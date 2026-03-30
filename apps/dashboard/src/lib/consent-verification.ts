import { api } from './api';

export interface ConsentStatus {
  hasAccess: boolean;
  missingConsents: string[];
  lastUpdated: string | null;
}

export async function verifyPatientConsent(patientId: string): Promise<ConsentStatus> {
  try {
    const response = await api.get(`/clinician/patients/${patientId}/assignment-status`);
    const assignment = response.data?.data;

    if (!assignment || assignment.status !== 'active') {
      return {
        hasAccess: false,
        missingConsents: ['clinician_data_access'],
        lastUpdated: null,
      };
    }

    return {
      hasAccess: true,
      missingConsents: [],
      lastUpdated: assignment.consent_granted_at,
    };
  } catch (error: any) {
    if (error.response?.status === 403) {
      const missing = error.response.data?.missing_consents || ['clinician_data_access'];
      return {
        hasAccess: false,
        missingConsents: missing,
        lastUpdated: null,
      };
    }
    throw error;
  }
}
