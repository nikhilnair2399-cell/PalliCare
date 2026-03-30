import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, lastValueFrom } from 'rxjs';
import { Pool } from 'pg';
import { DataAccessAuditInterceptor } from '../../src/common/interceptors/data-access-audit.interceptor';
import { DATABASE_POOL } from '../../src/database/database.module';

describe('DataAccessAuditInterceptor', () => {
  let interceptor: DataAccessAuditInterceptor;
  let pool: jest.Mocked<Pool>;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataAccessAuditInterceptor,
        Reflector,
        {
          provide: DATABASE_POOL,
          useValue: {
            query: jest.fn().mockResolvedValue({ rows: [] }),
          },
        },
      ],
    }).compile();

    interceptor = module.get(DataAccessAuditInterceptor);
    pool = module.get(DATABASE_POOL);
    reflector = module.get(Reflector);
  });

  function createMockContext(
    user: { id: string; role: string },
    method: string = 'GET',
    url: string = '/clinician/patients/p1',
    params: Record<string, string> = { id: 'patient-1' },
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          method,
          url,
          params,
          ip: '127.0.0.1',
          headers: { 'user-agent': 'test-agent' },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  }

  const mockCallHandler: CallHandler = {
    handle: () => of({ data: 'test' }),
  };

  it('should log audit entry for decorated endpoint', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('patient_profile');
    const context = createMockContext({ id: 'clinician-1', role: 'clinician' });

    const result$ = interceptor.intercept(context, mockCallHandler);
    await lastValueFrom(result$);

    // Wait for async audit write
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO data_access_log'),
      expect.arrayContaining(['clinician-1', 'patient_profile']),
    );
  });

  it('should not log for non-decorated endpoint', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const context = createMockContext({ id: 'user-1', role: 'patient' });

    const result$ = interceptor.intercept(context, mockCallHandler);
    await lastValueFrom(result$);

    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should not block response if audit fails', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('patient_list');
    pool.query.mockRejectedValue(new Error('DB connection failed'));

    const context = createMockContext({ id: 'clinician-1', role: 'clinician' });
    const result$ = interceptor.intercept(context, mockCallHandler);
    const result = await lastValueFrom(result$);

    expect(result).toEqual({ data: 'test' });
  });

  it('should include correct action based on HTTP method', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue('patient_profile');
    const context = createMockContext(
      { id: 'clinician-1', role: 'clinician' },
      'PATCH',
    );

    const result$ = interceptor.intercept(context, mockCallHandler);
    await lastValueFrom(result$);
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(['update']),
    );
  });
});
