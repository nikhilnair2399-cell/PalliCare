import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService, JwtPayload } from './auth.service';
import { AuthRepository } from './auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepository;

  const mockAuthRepo = {
    findUserByPhone: jest.fn(),
    findUserById: jest.fn(),
    findClinicianByUserId: jest.fn(),
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

  // ── OTP Generation / Verification ─────────────────────────

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

    it('should normalize 12-digit phone starting with 91', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.requestOtp({ phone: '919876543210' });

      expect(mockAuthRepo.storeOtp).toHaveBeenCalledWith(
        '+919876543210',
        expect.any(String),
        300,
      );
    });

    it('should strip spaces and dashes from phone numbers', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.requestOtp({ phone: '+91 98765-43210' });

      expect(mockAuthRepo.storeOtp).toHaveBeenCalledWith(
        '+919876543210',
        expect.any(String),
        300,
      );
    });

    it('should log an auth event for OTP request', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.requestOtp({ phone: '+919876543210' });

      expect(mockAuthRepo.logAuthEvent).toHaveBeenCalledWith(
        null,
        'otp_requested',
        { phone: '+919876543210' },
      );
    });

    it('should generate an OTP of configured length', async () => {
      mockAuthRepo.storeOtp.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.requestOtp({ phone: '+919876543210' });

      // OTP should be a 6-digit string (OTP_LENGTH = 6 in config)
      const storedOtp = mockAuthRepo.storeOtp.mock.calls[0][1];
      expect(storedOtp).toMatch(/^\d{6}$/);
    });
  });

  describe('verifyOtp', () => {
    const mockPatientUser = {
      id: 'user-123',
      type: 'patient',
      phone: '+919876543210',
      name: 'Test User',
      is_active: true,
    };

    it('should reject invalid OTP', async () => {
      mockAuthRepo.verifyOtp.mockResolvedValue(false);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await expect(
        service.verifyOtp({ phone: '+919876543210', otp: '999999' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should log failed OTP verification', async () => {
      mockAuthRepo.verifyOtp.mockResolvedValue(false);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service
        .verifyOtp({ phone: '+919876543210', otp: '999999' })
        .catch(() => {});

      expect(mockAuthRepo.logAuthEvent).toHaveBeenCalledWith(
        null,
        'otp_verify_failed',
        { phone: '+919876543210' },
      );
    });

    it('should accept dev bypass OTP 000000', async () => {
      mockAuthRepo.findUserByPhone.mockResolvedValue(mockPatientUser);
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

    it('should accept valid OTP via repository verification', async () => {
      mockAuthRepo.verifyOtp.mockResolvedValue(true);
      mockAuthRepo.findUserByPhone.mockResolvedValue(mockPatientUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      const result = await service.verifyOtp({
        phone: '+919876543210',
        otp: '123456',
      });

      expect(result.access_token).toBeDefined();
      expect(result.user.id).toBe('user-123');
    });

    it('should update last login timestamp on successful verification', async () => {
      mockAuthRepo.findUserByPhone.mockResolvedValue(mockPatientUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.verifyOtp({ phone: '+919876543210', otp: '000000' });

      expect(mockAuthRepo.updateLastLogin).toHaveBeenCalledWith('user-123');
    });

    it('should log login_success event', async () => {
      mockAuthRepo.findUserByPhone.mockResolvedValue(mockPatientUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.verifyOtp({ phone: '+919876543210', otp: '000000' });

      expect(mockAuthRepo.logAuthEvent).toHaveBeenCalledWith(
        'user-123',
        'login_success',
        { phone: '+919876543210' },
      );
    });
  });

  // ── JWT Token Generation ──────────────────────────────────

  describe('token generation', () => {
    it('should generate access and refresh tokens for patient user', async () => {
      const mockUser = {
        id: 'user-pat-1',
        type: 'patient',
        phone: '+919876543210',
        name: 'Patient User',
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
      expect(result.token_type).toBe('bearer');
      expect(result.expires_in).toBe(3600);

      // Verify JWT sign was called with correct payload
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'user-pat-1',
          role: 'patient',
          phone: '+919876543210',
        }),
      );
    });

    it('should include clinician permissions in token for clinician users', async () => {
      const mockClinician = {
        id: 'user-doc-1',
        type: 'clinician',
        phone: '+919876543211',
        name: 'Dr. Gupta',
        is_active: true,
      };

      const mockClinicianRow = {
        id: 'clinician-1',
        user_id: 'user-doc-1',
        role: 'doctor',
        designation: 'Senior Consultant',
        department: 'Palliative Care',
        can_prescribe: true,
        can_export_research: false,
        can_manage_users: false,
      };

      mockAuthRepo.findUserByPhone.mockResolvedValue(mockClinician);
      mockAuthRepo.findClinicianByUserId.mockResolvedValue(mockClinicianRow);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      const result = await service.verifyOtp({
        phone: '+919876543211',
        otp: '000000',
      });

      expect(result.user.clinicianRole).toBe('doctor');
      expect(result.user.permissions).toEqual({
        canPrescribe: true,
        canExportResearch: false,
        canManageUsers: false,
      });
      expect(result.user.department).toBe('Palliative Care');
      expect(result.user.designation).toBe('Senior Consultant');

      // Verify JWT payload includes clinician data
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'user-doc-1',
          role: 'clinician',
          clinicianRole: 'doctor',
          permissions: {
            canPrescribe: true,
            canExportResearch: false,
            canManageUsers: false,
          },
        }),
      );
    });

    it('should generate refresh token with custom expiry from config', async () => {
      const mockUser = {
        id: 'user-1',
        type: 'patient',
        phone: '+919876543210',
        name: 'Test',
        is_active: true,
      };

      mockAuthRepo.findUserByPhone.mockResolvedValue(mockUser);
      mockAuthRepo.updateLastLogin.mockResolvedValue(undefined);
      mockAuthRepo.logAuthEvent.mockResolvedValue(undefined);

      await service.verifyOtp({ phone: '+919876543210', otp: '000000' });

      // Second call to jwtService.sign is for the refresh token
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        { expiresIn: '30d' },
      );
    });
  });

  // ── Token Refresh ─────────────────────────────────────────

  describe('refreshToken', () => {
    it('should return new tokens for a valid refresh token', async () => {
      const payload: JwtPayload = {
        sub: 'user-123',
        role: 'patient',
        phone: '+919876543210',
      };

      const mockUser = {
        id: 'user-123',
        type: 'patient',
        phone: '+919876543210',
        name: 'Test User',
        is_active: true,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthRepo.findUserById.mockResolvedValue(mockUser);

      const result = await service.refreshToken('valid-refresh-token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-refresh-token');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBe('mock-jwt-token');
      expect(result.token_type).toBe('bearer');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(
        service.refreshToken('expired-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'deleted-user',
        role: 'patient',
        phone: '+910000000000',
      });
      mockAuthRepo.findUserById.mockResolvedValue(null);

      await expect(
        service.refreshToken('valid-but-user-gone'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'user-inactive',
        role: 'patient',
        phone: '+919876543210',
      });

      mockAuthRepo.findUserById.mockResolvedValue({
        id: 'user-inactive',
        type: 'patient',
        is_active: false,
      });

      await expect(
        service.refreshToken('token-for-inactive-user'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should fetch clinician data when refreshing a clinician token', async () => {
      const payload: JwtPayload = {
        sub: 'user-doc-1',
        role: 'clinician',
        phone: '+919876543211',
      };

      const mockClinicianUser = {
        id: 'user-doc-1',
        type: 'clinician',
        phone: '+919876543211',
        name: 'Dr. Gupta',
        is_active: true,
      };

      const mockClinicianRow = {
        id: 'clinician-1',
        user_id: 'user-doc-1',
        role: 'doctor',
        can_prescribe: true,
        can_export_research: false,
        can_manage_users: false,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockAuthRepo.findUserById.mockResolvedValue(mockClinicianUser);
      mockAuthRepo.findClinicianByUserId.mockResolvedValue(mockClinicianRow);

      const result = await service.refreshToken('clinician-refresh-token');

      expect(mockAuthRepo.findClinicianByUserId).toHaveBeenCalledWith('user-doc-1');
      expect(result.access_token).toBeDefined();
    });
  });

  // ── Validate User (JWT Strategy) ──────────────────────────

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
