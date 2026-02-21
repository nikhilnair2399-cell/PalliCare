import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const patientApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach patient auth token
patientApi.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('patient_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — redirect to patient login on 401
patientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/patient/login';
      }
    }
    return Promise.reject(error);
  },
);

// ── API Functions ────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Auth */
export const patientAuthApi = {
  requestOtp: (phone: string) =>
    patientApi.post('/auth/otp/request', { phone, role: 'patient' }),
  verifyOtp: (phone: string, otp: string) =>
    patientApi.post('/auth/otp/verify', { phone, otp }),
};

/** Profile */
export const patientProfileApi = {
  getMe: () => patientApi.get('/patients/me'),
  updateMe: (data: any) => patientApi.patch('/patients/me', data),
};

/** Symptom Logs */
export const patientSymptomApi = {
  list: (params?: { start_date?: string; end_date?: string; log_type?: string }) =>
    patientApi.get('/patients/me/logs', { params }),
  create: (data: any) => patientApi.post('/patients/me/logs', data),
  getDailySummary: (startDate: string, endDate: string) =>
    patientApi.get('/patients/me/logs/summary/daily', {
      params: { start_date: startDate, end_date: endDate },
    }),
};

/** Medications */
export const patientMedicationApi = {
  list: () => patientApi.get('/patients/me/medications'),
  logAdherence: (
    medicationId: string,
    data: { status: string; time_taken?: string; notes?: string },
  ) => patientApi.post(`/medications/${medicationId}/log`, data),
};

/** Wellness */
export const patientWellnessApi = {
  getSummary: () => patientApi.get('/patients/me/wellness/summary'),

  // Goals
  getGoals: (status?: string) =>
    patientApi.get('/patients/me/goals', { params: { status } }),
  createGoal: (data: any) => patientApi.post('/patients/me/goals', data),
  updateGoal: (goalId: string, data: any) =>
    patientApi.patch(`/patients/me/goals/${goalId}`, data),
  logGoal: (goalId: string, date: string, completed: boolean, notes?: string) =>
    patientApi.post(`/patients/me/goals/${goalId}/log`, { date, completed, notes }),

  // Gratitude
  getGratitude: (limit?: number) =>
    patientApi.get('/patients/me/gratitude', { params: { limit } }),
  getTodayGratitude: () => patientApi.get('/patients/me/gratitude/today'),
  saveGratitude: (content: string, voiceNoteUrl?: string) =>
    patientApi.post('/patients/me/gratitude', { content, voice_note_url: voiceNoteUrl }),
  getGratitudeStreak: () => patientApi.get('/patients/me/gratitude/streak'),

  // Intentions
  getIntentions: (limit?: number) =>
    patientApi.get('/patients/me/intentions', { params: { limit } }),
  getTodayIntention: () => patientApi.get('/patients/me/intentions/today'),
  saveIntention: (content: string) =>
    patientApi.post('/patients/me/intentions', { content }),
  completeIntention: (date: string, status: string) =>
    patientApi.patch(`/patients/me/intentions/${date}/status`, { status }),

  // Milestones
  getMilestones: (unseenOnly?: boolean) =>
    patientApi.get('/patients/me/milestones', { params: { unseen_only: unseenOnly } }),
  getUnseenCount: () => patientApi.get('/patients/me/milestones/unseen-count'),
  markSeen: (id: string) => patientApi.patch(`/patients/me/milestones/${id}/seen`),
};

/** Education */
export const patientEducationApi = {
  list: () => patientApi.get('/patients/me/education'),
  get: (id: string) => patientApi.get(`/patients/me/education/${id}`),
  updateProgress: (id: string, progress: number) =>
    patientApi.post(`/patients/me/education/${id}/progress`, { progress }),
};

/** Breathe */
export const patientBreatheApi = {
  logSession: (data: { technique: string; duration: number; rating?: number }) =>
    patientApi.post('/patients/me/breathe', data),
  getHistory: () => patientApi.get('/patients/me/breathe'),
  getStats: () => patientApi.get('/patients/me/breathe/stats'),
};

/** Messages */
export const patientMessagesApi = {
  list: (params?: { thread_id?: string }) =>
    patientApi.get('/patients/me/messages', { params }),
  send: (content: string, recipientId?: string) =>
    patientApi.post('/messages', { content, recipient_id: recipientId }),
  markRead: (id: string) => patientApi.patch(`/messages/${id}/read`),
  unreadCount: () => patientApi.get('/messages/unread-count'),
};

/** Care Plan */
export const patientCarePlanApi = {
  get: () => patientApi.get('/patients/me/care-plan'),
};

/** Notifications */
export const patientNotificationsApi = {
  list: (unreadOnly?: boolean) =>
    patientApi.get('/notifications', { params: { unread_only: unreadOnly } }),
  markRead: (id: string) => patientApi.patch(`/notifications/${id}/read`),
  markAllRead: () => patientApi.post('/notifications/read-all'),
};
