import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  patientsApi,
  alertsApi,
  analyticsApi,
  clinicalNotesApi,
  carePlansApi,
  caregiversApi,
  messagesApi,
  medicationDbApi,
  notificationsApi,
  healthApi,
  verificationApi,
} from './api';

/* ================================================================== */
/*  Query Key Factory                                                  */
/* ================================================================== */

export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    list: (params?: Record<string, unknown>) => ['patients', 'list', params] as const,
    detail: (id: string) => ['patients', id] as const,
    symptomLogs: (id: string) => ['patients', id, 'symptom-logs'] as const,
    medications: (id: string) => ['patients', id, 'medications'] as const,
    painTrends: (id: string, days?: number) => ['patients', id, 'pain-trends', days] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    list: (params?: Record<string, unknown>) => ['alerts', 'list', params] as const,
    counts: ['alerts', 'counts'] as const,
  },
  analytics: {
    departmentSummary: ['analytics', 'department-summary'] as const,
    painDistribution: ['analytics', 'pain-distribution'] as const,
    medicationAdherence: (weeks?: number) => ['analytics', 'medication-adherence', weeks] as const,
    meddDistribution: ['analytics', 'medd-distribution'] as const,
    qualityMetrics: ['analytics', 'quality-metrics'] as const,
  },
  notes: {
    list: (patientId: string, params?: Record<string, unknown>) =>
      ['notes', patientId, params] as const,
    detail: (id: string) => ['notes', id] as const,
    myNotes: (params?: Record<string, unknown>) => ['notes', 'mine', params] as const,
  },
  carePlans: {
    list: (patientId: string) => ['care-plans', patientId] as const,
    active: (patientId: string) => ['care-plans', patientId, 'active'] as const,
    detail: (id: string) => ['care-plans', 'detail', id] as const,
  },
  caregivers: {
    byPatient: (patientId: string) => ['caregivers', patientId] as const,
    schedules: (patientId: string) => ['caregivers', patientId, 'schedules'] as const,
    handoverNotes: (patientId: string) => ['caregivers', patientId, 'handover'] as const,
  },
  messages: {
    patient: (patientId: string) => ['messages', patientId] as const,
    threads: (patientId: string) => ['messages', patientId, 'threads'] as const,
    unreadCount: ['messages', 'unread-count'] as const,
  },
  medicationDb: {
    search: (query: string) => ['medication-db', 'search', query] as const,
    palliative: ['medication-db', 'palliative'] as const,
    opioidRef: ['medication-db', 'opioid-reference'] as const,
  },
  notifications: {
    list: (params?: Record<string, unknown>) => ['notifications', params] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  health: ['health'] as const,
  verification: {
    report: ['verification', 'report'] as const,
  },
};

/* ================================================================== */
/*  Patient Hooks                                                      */
/* ================================================================== */

export function usePatients(params?: {
  status?: string;
  search?: string;
  sort_by?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: queryKeys.patients.list(params),
    queryFn: () => patientsApi.list(params).then((r) => r.data),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id),
    queryFn: () => patientsApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function usePatientSymptomLogs(
  patientId: string,
  params?: { from?: string; to?: string },
) {
  return useQuery({
    queryKey: queryKeys.patients.symptomLogs(patientId),
    queryFn: () => patientsApi.getSymptomLogs(patientId, params).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function usePatientMedications(patientId: string) {
  return useQuery({
    queryKey: queryKeys.patients.medications(patientId),
    queryFn: () => patientsApi.getMedications(patientId).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function usePatientPainTrends(patientId: string, days = 30) {
  return useQuery({
    queryKey: queryKeys.patients.painTrends(patientId, days),
    queryFn: () => patientsApi.getPainTrends(patientId, days).then((r) => r.data),
    enabled: !!patientId,
  });
}

/* ================================================================== */
/*  Alert Hooks                                                        */
/* ================================================================== */

export function useAlerts(params?: { severity?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.alerts.list(params),
    queryFn: () => alertsApi.list(params).then((r) => r.data),
  });
}

export function useAlertCounts() {
  return useQuery({
    queryKey: queryKeys.alerts.counts,
    queryFn: () => alertsApi.counts().then((r) => r.data),
    refetchInterval: 30_000, // Poll every 30s for real-time alert counts
  });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.acknowledge(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      alertsApi.resolve(id, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/* ================================================================== */
/*  Analytics Hooks                                                    */
/* ================================================================== */

export function useDepartmentSummary() {
  return useQuery({
    queryKey: queryKeys.analytics.departmentSummary,
    queryFn: () => analyticsApi.departmentSummary().then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function usePainDistribution() {
  return useQuery({
    queryKey: queryKeys.analytics.painDistribution,
    queryFn: () => analyticsApi.painDistribution().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicationAdherence(weeks = 4) {
  return useQuery({
    queryKey: queryKeys.analytics.medicationAdherence(weeks),
    queryFn: () => analyticsApi.medicationAdherence(weeks).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useQualityMetrics() {
  return useQuery({
    queryKey: queryKeys.analytics.qualityMetrics,
    queryFn: () => analyticsApi.qualityMetrics().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

/* ================================================================== */
/*  Clinical Notes Hooks                                               */
/* ================================================================== */

export function useClinicalNotes(
  patientId: string,
  params?: { note_type?: string; page?: number },
) {
  return useQuery({
    queryKey: queryKeys.notes.list(patientId, params),
    queryFn: () => clinicalNotesApi.list(patientId, params).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: { note_type: string; content: string; structured_data?: any };
    }) => clinicalNotesApi.create(patientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

/* ================================================================== */
/*  Care Plan Hooks                                                    */
/* ================================================================== */

export function useCarePlans(patientId: string, status?: string) {
  return useQuery({
    queryKey: queryKeys.carePlans.list(patientId),
    queryFn: () => carePlansApi.list(patientId, status).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useActiveCarePlan(patientId: string) {
  return useQuery({
    queryKey: queryKeys.carePlans.active(patientId),
    queryFn: () => carePlansApi.getActive(patientId).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useCreateCarePlanVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carePlansApi.newVersion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['care-plans'] });
    },
  });
}

/* ================================================================== */
/*  Caregiver Hooks                                                    */
/* ================================================================== */

export function usePatientCaregivers(patientId: string) {
  return useQuery({
    queryKey: queryKeys.caregivers.byPatient(patientId),
    queryFn: () => caregiversApi.listByPatient(patientId).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useCareSchedules(
  patientId: string,
  params?: { start_date?: string; end_date?: string },
) {
  return useQuery({
    queryKey: queryKeys.caregivers.schedules(patientId),
    queryFn: () => caregiversApi.getSchedules(patientId, params).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useHandoverNotes(patientId: string) {
  return useQuery({
    queryKey: queryKeys.caregivers.handoverNotes(patientId),
    queryFn: () => caregiversApi.getHandoverNotes(patientId).then((r) => r.data),
    enabled: !!patientId,
  });
}

/* ================================================================== */
/*  Message Hooks                                                      */
/* ================================================================== */

export function usePatientMessages(
  patientId: string,
  params?: { thread_id?: string; page?: number },
) {
  return useQuery({
    queryKey: queryKeys.messages.patient(patientId),
    queryFn: () => messagesApi.getPatientMessages(patientId, params).then((r) => r.data),
    enabled: !!patientId,
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: queryKeys.messages.unreadCount,
    queryFn: () => messagesApi.unreadCount().then((r) => r.data),
    refetchInterval: 30_000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      patient_id: string;
      recipient_id?: string;
      content: string;
      message_type?: string;
    }) => messagesApi.send(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

/* ================================================================== */
/*  Medication DB Hooks                                                */
/* ================================================================== */

export function useMedicationSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: queryKeys.medicationDb.search(query),
    queryFn: () => medicationDbApi.search(query, limit).then((r) => r.data),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000, // Cache search results 10 min
  });
}

export function usePalliativeMedications() {
  return useQuery({
    queryKey: queryKeys.medicationDb.palliative,
    queryFn: () => medicationDbApi.palliative().then((r) => r.data),
    staleTime: 30 * 60 * 1000, // Reference data — cache 30 min
  });
}

export function useOpioidReference() {
  return useQuery({
    queryKey: queryKeys.medicationDb.opioidRef,
    queryFn: () => medicationDbApi.opioidReference().then((r) => r.data),
    staleTime: 30 * 60 * 1000,
  });
}

/* ================================================================== */
/*  Notification Hooks                                                 */
/* ================================================================== */

export function useNotifications(params?: {
  unread_only?: boolean;
  type?: string;
}) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationsApi.list(params).then((r) => r.data),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => notificationsApi.unreadCount().then((r) => r.data),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/* ================================================================== */
/*  Health Check                                                       */
/* ================================================================== */

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => healthApi.check().then((r) => r.data),
    refetchInterval: 60_000, // Check health every minute
    retry: 1,
  });
}

/* ================================================================== */
/*  Verification (dev-only)                                            */
/* ================================================================== */

export function useRunVerification() {
  return useMutation({
    mutationFn: () => verificationApi.run().then((r) => r.data),
  });
}
