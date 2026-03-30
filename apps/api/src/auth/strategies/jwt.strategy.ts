import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'pallicare-dev-secret-key-change-in-production'),
      issuer: config.get('JWT_ISSUER', 'pallicare.aiims.edu'),
      audience: config.get('JWT_AUDIENCE', 'pallicare-api'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      role: user.type,
      phone: user.phone,
      name: user.name,
      clinicianRole: payload.clinicianRole ?? null,
      permissions: payload.permissions ?? null,
    };
  }
}
