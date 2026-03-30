import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Pool } from 'pg';
import { REQUIRED_CONSENTS_KEY } from '../decorators/require-consent.decorator';
import { ConsentService } from '../../consent/consent.service';
import { DATABASE_POOL } from '../../database/database.module';

/**
 * ConsentGuard
 *
 * Ensures the target user (patient) has actively granted all
 * consent types required by the @RequireConsent() decorator
 * before the route handler executes.
 *
 * Resolution logic:
 *   1. If the requesting user IS a patient, their own user ID
 *      is checked for active consents.
 *   2. If the requesting user is a clinician accessing a patient
 *      resource (identified by request.params.id as a patient ID),
 *      the patient's owning user_id is resolved via a DB lookup
 *      and that user's consents are checked.
 *   3. If no required consents are declared on the handler,
 *      the guard passes through.
 */
@Injectable()
export class ConsentGuard implements CanActivate {
  private readonly logger = new Logger(ConsentGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly consentService: ConsentService,
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredConsents = this.reflector.get<string[]>(
      REQUIRED_CONSENTS_KEY,
      context.getHandler(),
    );

    // No consent requirements on this handler — allow through
    if (!requiredConsents || requiredConsents.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new ForbiddenException('Authentication required');
    }

    const userRole: string = user.role ?? user.type ?? '';
    let targetUserId: string = user.sub;

    // If the requestor is a clinician accessing a patient resource,
    // resolve the patient's user_id from the patients table
    if (
      ['clinician', 'admin', 'researcher'].includes(userRole) &&
      request.params?.id
    ) {
      const patientId = request.params.id;
      try {
        const result = await this.pool.query(
          `SELECT user_id FROM patients WHERE id = $1 LIMIT 1`,
          [patientId],
        );
        if (result.rows.length > 0) {
          targetUserId = result.rows[0].user_id;
        }
        // If the param isn't a valid patient ID, fall back to the
        // requesting user's own consents
      } catch {
        // UUID parse error or DB issue — fall through to user's own consents
        this.logger.warn(
          `Could not resolve patient user_id for params.id=${request.params.id}`,
        );
      }
    }

    // Fetch the target user's active consents
    const activeConsents = await this.consentService.getActiveConsents(
      targetUserId,
    );

    const grantedTypes = new Set(
      activeConsents.map((c: any) => c.consent_type),
    );

    // Check every required consent type is actively granted
    const missing = requiredConsents.filter((ct) => !grantedTypes.has(ct));

    if (missing.length > 0) {
      this.logger.warn(
        `Consent check failed for user ${targetUserId}: missing [${missing.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Required consent not granted: ${missing.join(', ')}`,
      );
    }

    return true;
  }
}
