import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  patientProfileApi,
  patientSymptomApi,
  patientMedicationApi,
  patientWellnessApi,
  patientEducationApi,
  patientBreatheApi,
  patientMessagesApi,
  patientCarePlanApi,
  patientNotificationsApi,
} from './patient-api';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ================================================================== */
/*  Query Key Factory                                                  */
/* ================================================================== */

export const patientQueryKeys = {
  profile: ['patient', 'me'] as const,
  symptoms: {
    all: ['patient', 'symptoms'] as const,
    list: (params?: Record<string, unknown>) =>
      ['patient', 'symptoms', 'list', params] as const,
    dailySummary: (start: string, end: string) =>
      ['patient', 'symptoms', 'daily', start, end] as const,
  },
  medications: ['patient', 'medications'] as const,
  wellness: {
    summary: ['patient', 'wellness', 'summary'] as const,
    goals: (status?: string) =>
      ['patient', 'wellness', 'goals', status] as const,
    goalHistory: (id: string, days?: number) =>
      ['patient', 'wellness', 'goals', id, 'history', days] as const,
    gratitude: ['patient', 'wellness', 'gratitude'] as const,
    gratitudeToday: ['patient', 'wellness', 'gratitude', 'today'] as const,
    gratitudeStreak: ['patient', 'wellness', 'gratitude', 'streak'] as const,
    intentions: ['patient', 'wellness', 'intentions'] as const,
    intentionToday: ['patient', 'wellness', 'intentions', 'today'] as const,
    milestones: (unseenOnly?: boolean) =>
      ['patient', 'wellness', 'milestones', unseenOnly] as const,
    milestonesUnseenCount: ['patient', 'wellness', 'milestones', 'unseen-count'] as const,
  },
  education: {
    list: ['patient', 'education'] as const,
    detail: (id: string) => ['patient', 'education', id] as const,
  },
  breathe: {
    history: ['patient', 'breathe', 'history'] as const,
    stats: ['patient', 'breathe', 'stats'] as const,
  },
  messages: {
    all: ['patient', 'messages'] as const,
    list: (params?: Record<string, unknown>) =>
      ['patient', 'messages', 'list', params] as const,
    unreadCount: ['patient', 'messages', 'unread-count'] as const,
  },
  carePlan: ['patient', 'care-plan'] as const,
  notifications: {
    list: (unreadOnly?: boolean) =>
      ['patient', 'notifications', unreadOnly] as const,
  },
};

/* ================================================================== */
/*  Profile Hooks                                                      */
/* ================================================================== */

export function usePatientProfile() {
  return useQuery({
    queryKey: patientQueryKeys.profile,
    queryFn: () => patientProfileApi.getMe().then((r) => r.data),
  });
}

export function useUpdatePatientProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => patientProfileApi.updateMe(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.profile });
    },
  });
}

/* ================================================================== */
/*  Symptom Hooks                                                      */
/* ================================================================== */

export function usePatientSymptoms(params?: {
  start_date?: string;
  end_date?: string;
  log_type?: string;
}) {
  return useQuery({
    queryKey: patientQueryKeys.symptoms.list(params),
    queryFn: () => patientSymptomApi.list(params).then((r) => r.data),
  });
}

export function useCreateSymptomLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => patientSymptomApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.symptoms.all });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

export function useDailySummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: patientQueryKeys.symptoms.dailySummary(startDate, endDate),
    queryFn: () =>
      patientSymptomApi.getDailySummary(startDate, endDate).then((r) => r.data),
    enabled: !!startDate && !!endDate,
  });
}

/* ================================================================== */
/*  Medication Hooks                                                   */
/* ================================================================== */

export function usePatientMedications() {
  return useQuery({
    queryKey: patientQueryKeys.medications,
    queryFn: () => patientMedicationApi.list().then((r) => r.data),
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useLogMedicationAdherence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicationId,
      status,
      timeTaken,
      notes,
    }: {
      medicationId: string;
      status: string;
      timeTaken?: string;
      notes?: string;
    }) =>
      patientMedicationApi.logAdherence(medicationId, {
        status,
        time_taken: timeTaken,
        notes,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.medications });
    },
  });
}

/* ================================================================== */
/*  Wellness Hooks                                                     */
/* ================================================================== */

export function useWellnessSummary() {
  return useQuery({
    queryKey: patientQueryKeys.wellness.summary,
    queryFn: () => patientWellnessApi.getSummary().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

// Goals
export function useGoals(status?: string) {
  return useQuery({
    queryKey: patientQueryKeys.wellness.goals(status),
    queryFn: () => patientWellnessApi.getGoals(status).then((r) => r.data),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => patientWellnessApi.createGoal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'wellness', 'goals'] });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

export function useLogGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      goalId,
      date,
      completed,
      notes,
    }: {
      goalId: string;
      date: string;
      completed: boolean;
      notes?: string;
    }) => patientWellnessApi.logGoal(goalId, date, completed, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'wellness', 'goals'] });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

// Gratitude
export function useGratitude(limit?: number) {
  return useQuery({
    queryKey: patientQueryKeys.wellness.gratitude,
    queryFn: () => patientWellnessApi.getGratitude(limit).then((r) => r.data),
  });
}

export function useTodayGratitude() {
  return useQuery({
    queryKey: patientQueryKeys.wellness.gratitudeToday,
    queryFn: () => patientWellnessApi.getTodayGratitude().then((r) => r.data),
  });
}

export function useSaveGratitude() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      voiceNoteUrl,
    }: {
      content: string;
      voiceNoteUrl?: string;
    }) => patientWellnessApi.saveGratitude(content, voiceNoteUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.gratitude });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.gratitudeToday });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.gratitudeStreak });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

export function useGratitudeStreak() {
  return useQuery({
    queryKey: patientQueryKeys.wellness.gratitudeStreak,
    queryFn: () => patientWellnessApi.getGratitudeStreak().then((r) => r.data),
  });
}

// Intentions
export function useIntentions(limit?: number) {
  return useQuery({
    queryKey: patientQueryKeys.wellness.intentions,
    queryFn: () => patientWellnessApi.getIntentions(limit).then((r) => r.data),
  });
}

export function useTodayIntention() {
  return useQuery({
    queryKey: patientQueryKeys.wellness.intentionToday,
    queryFn: () => patientWellnessApi.getTodayIntention().then((r) => r.data),
  });
}

export function useSaveIntention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => patientWellnessApi.saveIntention(content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.intentions });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.intentionToday });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

export function useCompleteIntention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, status }: { date: string; status: string }) =>
      patientWellnessApi.completeIntention(date, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.intentionToday });
      qc.invalidateQueries({ queryKey: patientQueryKeys.wellness.summary });
    },
  });
}

// Milestones
export function useMilestones(unseenOnly?: boolean) {
  return useQuery({
    queryKey: patientQueryKeys.wellness.milestones(unseenOnly),
    queryFn: () =>
      patientWellnessApi.getMilestones(unseenOnly).then((r) => r.data),
  });
}

export function useUnseenMilestonesCount() {
  return useQuery({
    queryKey: patientQueryKeys.wellness.milestonesUnseenCount,
    queryFn: () => patientWellnessApi.getUnseenCount().then((r) => r.data),
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useMarkMilestoneSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientWellnessApi.markSeen(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'wellness', 'milestones'] });
    },
  });
}

/* ================================================================== */
/*  Education Hooks                                                    */
/* ================================================================== */

export function useEducationModules() {
  return useQuery({
    queryKey: patientQueryKeys.education.list,
    queryFn: () => patientEducationApi.list().then((r) => r.data),
  });
}

export function useEducationModule(id: string) {
  return useQuery({
    queryKey: patientQueryKeys.education.detail(id),
    queryFn: () => patientEducationApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useUpdateEducationProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      patientEducationApi.updateProgress(id, progress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'education'] });
    },
  });
}

/* ================================================================== */
/*  Breathe Hooks                                                      */
/* ================================================================== */

export function useLogBreatheSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { technique: string; duration: number; rating?: number }) =>
      patientBreatheApi.logSession(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.breathe.history });
      qc.invalidateQueries({ queryKey: patientQueryKeys.breathe.stats });
    },
  });
}

export function useBreatheHistory() {
  return useQuery({
    queryKey: patientQueryKeys.breathe.history,
    queryFn: () => patientBreatheApi.getHistory().then((r) => r.data),
  });
}

export function useBreatheStats() {
  return useQuery({
    queryKey: patientQueryKeys.breathe.stats,
    queryFn: () => patientBreatheApi.getStats().then((r) => r.data),
  });
}

/* ================================================================== */
/*  Messages Hooks                                                     */
/* ================================================================== */

export function usePatientMessages(params?: { thread_id?: string }) {
  return useQuery({
    queryKey: patientQueryKeys.messages.list(params),
    queryFn: () => patientMessagesApi.list(params).then((r) => r.data),
  });
}

export function useSendPatientMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      recipientId,
    }: {
      content: string;
      recipientId?: string;
    }) => patientMessagesApi.send(content, recipientId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientQueryKeys.messages.all });
    },
  });
}

export function usePatientUnreadCount() {
  return useQuery({
    queryKey: patientQueryKeys.messages.unreadCount,
    queryFn: () => patientMessagesApi.unreadCount().then((r) => r.data),
    refetchInterval: 30_000,
  });
}

/* ================================================================== */
/*  Care Plan Hook                                                     */
/* ================================================================== */

export function usePatientCarePlan() {
  return useQuery({
    queryKey: patientQueryKeys.carePlan,
    queryFn: () => patientCarePlanApi.get().then((r) => r.data),
  });
}

/* ================================================================== */
/*  Notifications Hooks                                                */
/* ================================================================== */

export function usePatientNotifications(unreadOnly?: boolean) {
  return useQuery({
    queryKey: patientQueryKeys.notifications.list(unreadOnly),
    queryFn: () =>
      patientNotificationsApi.list(unreadOnly).then((r) => r.data),
  });
}

export function useMarkPatientNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientNotificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient', 'notifications'] });
    },
  });
}

/* ================================================================== */
/*  Aliases (for refactored patient pages)                             */
/* ================================================================== */

export const useMedications = usePatientMedications;
export const usePatientWellnessSummary = useWellnessSummary;

export function usePainDiary() {
  return usePatientSymptoms({ log_type: 'pain_diary' });
}
