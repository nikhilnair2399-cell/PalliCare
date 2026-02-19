import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository, UserRow } from './auth.repository';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';

export interface JwtPayload {
  sub: string; // user ID
  role: string;
  phone: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Step 1: Request OTP for a phone number.
   * In production, this would send via MSG91. In development, we log it.
   */
  async requestOtp(dto: OtpRequestDto) {
    const phone = this.normalizePhone(dto.phone);
    const otpLength = this.config.get<number>('OTP_LENGTH', 6);
    const ttl = this.config.get<number>('OTP_EXPIRY_SECONDS', 300);

    // Generate OTP
    const otp = this.generateOtp(otpLength);

    // Store OTP
    await this.authRepo.storeOtp(phone, otp, ttl);

    // In development, log the OTP. In production, send via SMS gateway.
    if (this.config.get('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] OTP for ${phone}: ${otp}`);
    } else {
      // TODO: Integrate MSG91 SMS gateway
      this.logger.log(`OTP sent to ${phone} via SMS`);
    }

    await this.authRepo.logAuthEvent(null, 'otp_requested', { phone });

    return {
      message: 'OTP sent successfully',
      expires_in: ttl,
    };
  }

  /**
   * Step 2: Verify OTP and return JWT tokens.
   */
  async verifyOtp(dto: OtpVerifyDto) {
    const phone = this.normalizePhone(dto.phone);

    // Dev bypass: OTP "000000" always works in non-production
    const isDevBypass =
      this.config.get('NODE_ENV') !== 'production' && dto.otp === '000000';

    const isValid = isDevBypass || (await this.authRepo.verifyOtp(phone, dto.otp));

    if (!isValid) {
      await this.authRepo.logAuthEvent(null, 'otp_verify_failed', { phone });
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Find or create user
    let user = await this.authRepo.findUserByPhone(phone);
    if (!user) {
      // Auto-register on first login (India health-tech pattern)
      user = await this.authRepo.createUser(phone, `User ${phone.slice(-4)}`);
      this.logger.log(`New user registered: ${user.id} (${phone})`);
    }

    // Update last login
    await this.authRepo.updateLastLogin(user.id);
    await this.authRepo.logAuthEvent(user.id, 'login_success', { phone });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        role: user.type,
        name: user.name,
      },
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.authRepo.findUserById(payload.sub);

      if (!user || !user.is_active) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate JWT payload (used by JwtStrategy).
   */
  async validateUser(payload: JwtPayload): Promise<UserRow | null> {
    return this.authRepo.findUserById(payload.sub);
  }

  // ─── Private Helpers ─────────────────────────────────────

  private generateOtp(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  private normalizePhone(phone: string): string {
    // Ensure +91 prefix for Indian numbers
    const clean = phone.replace(/\s|-/g, '');
    if (clean.startsWith('+91')) return clean;
    if (clean.startsWith('91') && clean.length === 12) return `+${clean}`;
    if (clean.length === 10) return `+91${clean}`;
    return clean;
  }

  private generateTokens(user: UserRow) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.type,
      phone: user.phone,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRY', '30d'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer' as const,
      expires_in: 3600,
    };
  }
}
