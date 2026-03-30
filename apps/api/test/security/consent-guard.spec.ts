import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentGuard } from '../../src/common/guards/consent.guard';
import { ConsentService } from '../../src/consent/consent.service';

describe('ConsentGuard', () => {
  let guard: ConsentGuard;
  let consentService: jest.Mocked<ConsentService>;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentGuard,
        Reflector,
        {
          provide: ConsentService,
          useValue: {
            getActiveConsents: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ConsentGuard>(ConsentGuard);
    consentService = module.get(ConsentService);
    reflector = module.get(Reflector);
  });

  function createMockContext(user: { id: string; role: string }, params: Record<string, string> = {}): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user, params }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should allow access when no consent required (no decorator)', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const context = createMockContext({ id: 'user-1', role: 'clinician' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should allow clinician access when patient has granted consent', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['clinician_data_access']);
    consentService.getActiveConsents.mockResolvedValue([
      { consent_type: 'clinician_data_access', granted: true },
    ] as any);

    const context = createMockContext(
      { id: 'clinician-1', role: 'clinician' },
      { id: 'patient-1' },
    );
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should deny clinician access when patient has not granted consent', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['clinician_data_access']);
    consentService.getActiveConsents.mockResolvedValue([]);

    const context = createMockContext(
      { id: 'clinician-1', role: 'clinician' },
      { id: 'patient-1' },
    );
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should deny when consent was revoked', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['clinician_data_access']);
    consentService.getActiveConsents.mockResolvedValue([
      { consent_type: 'data_collection', granted: true },
      // clinician_data_access NOT in active consents (revoked)
    ] as any);

    const context = createMockContext(
      { id: 'clinician-1', role: 'clinician' },
      { id: 'patient-1' },
    );
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow admin access regardless of consent status', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['clinician_data_access']);
    consentService.getActiveConsents.mockResolvedValue([]);

    const context = createMockContext({ id: 'admin-1', role: 'admin' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should allow patient self-access without consent check', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['clinician_data_access']);
    const context = createMockContext({ id: 'patient-1', role: 'patient' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
