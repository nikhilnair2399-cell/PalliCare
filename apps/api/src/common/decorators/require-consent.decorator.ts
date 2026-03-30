import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by ConsentGuard to look up which consent
 * types are required for a given route handler.
 */
export const REQUIRED_CONSENTS_KEY = 'required_consents';

/**
 * Marks a controller method as requiring one or more active
 * patient consent records before access is granted.
 *
 * ConsentGuard checks the target user's (or patient's) consent
 * records and returns 403 if any required type is missing.
 *
 * @param consentTypes - One or more consent type strings that must
 *   be actively granted (e.g. 'data_collection', 'clinician_access',
 *   'research_participation').
 *
 * @example
 * ```ts
 * @Get(':id/symptoms')
 * @RequireConsent('data_collection', 'clinician_access')
 * async getSymptoms(@Param('id') id: string) { ... }
 * ```
 */
export const RequireConsent = (...consentTypes: string[]) =>
  SetMetadata(REQUIRED_CONSENTS_KEY, consentTypes);
