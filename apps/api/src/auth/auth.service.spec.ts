import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepository;

  const mockAuthRepo = {
    findUserByPhone: jest.fn(),
    findUserById: jest.fn(),
    updateLastLogin: jest.fn(),
    createUser: jest.fn(),
    storeOtp: jest.fn(),
    verifyOtp: jest.fn(),
    logAuthEvent: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        NODE_ENV: 'local',
        OTP_LENGTH: 6,
        OTP_EXPIRY_SECONDS: 300,
        JWT_REFRESH_TOKEN_EXPIRY: '30d',
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepository>(AuthRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('requestOtp', () => {
    it('should store OTP and return success', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      const result = await service.requestOtp({ phone: '+919876543210' });

      expect(result.message).toBe('OTP sent successfully');
      expect(result.expires_in).toBe(300);
      expect(mockAuthRepo.storeOtp).toHaveBeenCalledWith(
        '+919876543210',
        expect.any(String),
        300,
      );
    });

    it('should normalize 10-digit phone to +91 prefix', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.requestOtp({ phone: '9876543210' });

      expect(mockAuthRepo.storeOtp).toHaveBeenCalledWith(
        '+919876543210',
        expect.any(String),
        300,
      );
    });
  });

  describe('verifyOtp', () => {
    it('should reject invalid OTP', async () => {
      mockAuthRepo.verifyOtp.mockResolvedValue(false);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await expect(
        service.verifyOtp({ phone: '+919876543210', otp: '999999' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should accept dev bypass OTP 000000', async () => {
      const mockUser = {
        id: 'user-123',
        type: 'patient',
        phone: '+919876543210',
        name: 'Test User',
        is_active: true,
      };
      mockAuthRepo.findUserByPhone.mockResolvedValue(mockUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      const result = await service.verifyOtp({
        phone: '+919876543210',
        otp: '000000',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBe('mock-jwt-token');
      expect(result.user.id).toBe('user-123');
      expect(result.token_type).toBe('bearer');
    });

    it('should create new user on first login', async () => {
      const newUser = {
        id: 'new-user-456',
        type: 'patient',
        phone: '+919876543210',
        name: 'User 3210',
        is_active: true,
      };
      mockAuthRepo.findUserByPhone.mockResolvedValue(null);
      mockAuthRepo.createUser.mockResolvedValue(newUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      const result = await service.verifyOtp({
        phone: '+919876543210',
        otp: '000000',
      });

      expect(mockAuthRepo.createUser).toHaveBeenCalledWith(
        '+919876543210',
        'User 3210',
      );
      expect(result.user.id).toBe('new-user-456');
    });
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      const user = { id: 'user-123', type: 'patient', is_active: true };
      mockAuthRepo.findUserById.mockResolvedValue(user);

      const result = await service.validateUser({
        sub: 'user-123',
        role: 'patient',
        phone: '+919876543210',
      });

      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockAuthRepo.findUserById.mockResolvedValue(null);

      const result = await service.validateUser({
        sub: 'nonexistent',
        role: 'patient',
        phone: '+910000000000',
      });

      expect(result).toBeNull();
    });
  });
});
