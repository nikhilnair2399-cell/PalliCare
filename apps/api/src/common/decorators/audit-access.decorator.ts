import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by DataAccessAuditInterceptor to identify
 * which resource type is being accessed.
 */
export const AUDIT_RESOURCE_KEY = 'audit_resource';

/**
 * Marks a controller method for automatic data-access auditing.
 *
 * When applied, the DataAccessAuditInterceptor will log an entry
 * to the `data_access_log` table after the response is sent.
 *
 * @param resourceType - The clinical resource being accessed
 *   (e.g. 'patient', 'symptom_log', 'medication', 'clinical_note')
 *
 * @example
 * ```ts
 * @Get(':id')
 * @AuditAccess('patient')
 * async getPatient(@Param('id') id: string) { ... }
 * ```
 */
export const AuditAccess = (resourceType: string) =>
  SetMetadata(AUDIT_RESOURCE_KEY, resourceType);
