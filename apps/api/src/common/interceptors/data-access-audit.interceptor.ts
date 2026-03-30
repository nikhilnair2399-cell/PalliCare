import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Pool } from 'pg';
import { AUDIT_RESOURCE_KEY } from '../decorators/audit-access.decorator';
import { DATABASE_POOL } from '../../database/database.module';

/**
 * Maps HTTP methods to data_access_log action values.
 */
const METHOD_ACTION_MAP: Record<string, string> = {
  GET: 'read',
  POST: 'read',
  PUT: 'read',
  PATCH: 'read',
  DELETE: 'read',
};

/**
 * DataAccessAuditInterceptor
 *
 * Automatically logs clinical data access to the `data_access_log`
 * hypertable for DPDPA audit compliance.
 *
 * Activation:
 *   Apply the @AuditAccess('resource_type') decorator to any
 *   controller method that reads patient/clinical data.
 *
 * Behaviour:
 *   - Fires AFTER the response is sent (non-blocking).
 *   - Extracts accessor identity from the JWT payload on request.user.
 *   - Extracts the accessed patient ID from request.params.id.
 *   - Silently catches and logs any audit-write failures so the
 *     primary request is never disrupted.
 */
@Injectable()
export class DataAccessAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DataAccessAuditInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const resourceType = this.reflector.get<string>(
      AUDIT_RESOURCE_KEY,
      context.getHandler(),
    );

    // If the handler does not have @AuditAccess, pass through
    if (!resourceType) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = request.method?.toUpperCase() ?? 'GET';
    const action = METHOD_ACTION_MAP[method] ?? 'read';

    return next.handle().pipe(
      tap(() => {
        // Fire-and-forget: log the access asynchronously after response
        this.logAccess(request, resourceType, action).catch((err) => {
          this.logger.error(
            `Failed to write data access audit log: ${err.message}`,
            err.stack,
          );
        });
      }),
    );
  }

  private async logAccess(
    request: any,
    resourceType: string,
    action: string,
  ): Promise<void> {
    const user = request.user;
    if (!user?.sub) {
      // No authenticated user — skip audit
      return;
    }

    const accessorId: string = user.sub;
    const accessorRole: string | null = user.role ?? user.type ?? null;
    const accessedPatientId: string | null = request.params?.id ?? null;
    const ipAddress: string | null = request.ip ?? null;
    const userAgent: string | null =
      request.headers?.['user-agent']?.substring(0, 500) ?? null;

    await this.pool.query(
      `INSERT INTO data_access_log
        (accessor_id, accessor_role, accessed_patient_id, resource_type, resource_id, action, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        accessorId,
        accessorRole,
        accessedPatientId,
        resourceType,
        accessedPatientId, // resource_id defaults to the same param id
        action,
        ipAddress,
        userAgent,
      ],
    );
  }
}
