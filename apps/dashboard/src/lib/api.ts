import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// ── API Functions ────────────────────────────────────────
// Endpoint paths match the NestJS backend routes (apps/api)

/** Auth */
export const authApi = {
  requestOtp: (phone: string) => api.post('/auth/otp/request', { phone }),
  verifyOtp: (phone: string, otp: string) =>
    api.post('/auth/otp/verify', { phone, otp }),
  refreshToken: (refreshToken: string) =>
    api.post('/auth/token/refresh', { refresh_token: refreshToken }),
};

/** Patients (clinician view) */
export const patientsApi = {
  list: (params?: { status?: string; search?: string; sort_by?: string; page?: number }) =>
    api.get('/clinician/patients', { params }),
  get: (id: string) => api.get(`/clinician/patients/${id}`),
  getSymptomLogs: (id: string, params?: { from?: string; to?: string }) =>
    api.get(`/clinician/patients/${id}/symptom-logs`, { params }),
  getMedications: (id: string) => api.get(`/clinician/patients/${id}/medications`),
  getPainTrends: (id: string, days?: number) =>
    api.get(`/clinician/patients/${id}/pain-trends`, { params: { days: days || 30 } }),
};

/** Alerts */
export const alertsApi = {
  list: (params?: { severity?: string; status?: string }) =>
    api.get('/clinical-alerts', { params }),
  get: (id: string) => api.get(`/clinical-alerts/${id}`),
  counts: () => api.get('/clinical-alerts/counts'),
  acknowledge: (id: string) =>
    api.patch(`/clinical-alerts/${id}/acknowledge`),
  resolve: (id: string, notes?: string) =>
    api.patch(`/clinical-alerts/${id}/resolve`, { notes }),
  escalate: (id: string, escalateTo: string) =>
    api.post(`/clinical-alerts/${id}/escalate`, { escalate_to: escalateTo }),
};

/** Analytics */
export const analyticsApi = {
  departmentSummary: () => api.get('/analytics/department-summary'),
  painDistribution: () => api.get('/analytics/pain-distribution'),
  medicationAdherence: (weeks?: number) =>
    api.get('/analytics/medication-adherence', { params: { weeks } }),
  meddDistribution: () => api.get('/analytics/medd-distribution'),
  qualityMetrics: () => api.get('/analytics/quality-metrics'),
};

/** Notifications */
export const notificationsApi = {
  list: (params?: { unread_only?: boolean; type?: string }) =>
    api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

/** Clinical Notes */
export const clinicalNotesApi = {
  list: (patientId: string, params?: { note_type?: string; page?: number }) =>
    api.get(`/clinician/patients/${patientId}/notes`, { params }),
  get: (id: string) => api.get(`/clinician/notes/${id}`),
  create: (patientId: string, data: { note_type: string; content: string; structured_data?: any }) =>
    api.post(`/clinician/patients/${patientId}/notes`, data),
  update: (id: string, data: { content?: string; structured_data?: any }) =>
    api.patch(`/clinician/notes/${id}`, data),
  myNotes: (params?: { page?: number }) =>
    api.get('/clinician/notes', { params }),
};

/** Care Plans */
export const carePlansApi = {
  list: (patientId: string, status?: string) =>
    api.get(`/clinician/patients/${patientId}/care-plans`, { params: { status } }),
  getActive: (patientId: string) =>
    api.get(`/clinician/patients/${patientId}/care-plans/active`),
  get: (id: string) => api.get(`/clinician/care-plans/${id}`),
  create: (patientId: string, data: any) =>
    api.post(`/clinician/patients/${patientId}/care-plans`, data),
  update: (id: string, data: any) =>
    api.patch(`/clinician/care-plans/${id}`, data),
  newVersion: (id: string) =>
    api.post(`/clinician/care-plans/${id}/new-version`),
};

/** Caregivers */
export const caregiversApi = {
  listByPatient: (patientId: string) =>
    api.get(`/clinician/patients/${patientId}/caregivers`),
  update: (id: string, data: any) =>
    api.patch(`/clinician/caregivers/${id}`, data),
  getSchedules: (patientId: string, params?: { start_date?: string; end_date?: string }) =>
    api.get(`/clinician/patients/${patientId}/schedules`, { params }),
  createSchedule: (patientId: string, data: any) =>
    api.post(`/clinician/patients/${patientId}/schedules`, data),
  getHandoverNotes: (patientId: string) =>
    api.get(`/clinician/patients/${patientId}/handover-notes`),
  createHandoverNote: (patientId: string, data: { content: string; to_caregiver_id?: string }) =>
    api.post(`/clinician/patients/${patientId}/handover-notes`, data),
};

/** Messages */
export const messagesApi = {
  getPatientMessages: (patientId: string, params?: { thread_id?: string; page?: number }) =>
    api.get(`/messages/patient/${patientId}`, { params }),
  getThreads: (patientId: string) =>
    api.get(`/messages/patient/${patientId}/threads`),
  send: (data: { patient_id: string; recipient_id?: string; content: string; message_type?: string }) =>
    api.post('/messages', data),
  markRead: (id: string) =>
    api.patch(`/messages/${id}/read`),
  unreadCount: () =>
    api.get('/messages/unread-count'),
};

/** Medication Database (Reference) */
export const medicationDbApi = {
  search: (query: string, limit?: number) =>
    api.get('/medication-db/search', { params: { q: query, limit } }),
  get: (id: string) => api.get(`/medication-db/${id}`),
  palliative: () => api.get('/medication-db/palliative'),
  opioidReference: () => api.get('/medication-db/opioid-reference'),
};

/** Consent */
export const consentApi = {
  verifyPatientConsent: (patientId: string) =>
    api.get(`/clinician/patients/${patientId}/assignment-status`),
  requestAssignment: (patientId: string) =>
    api.post(`/clinician/patients/${patientId}/assign`),
};

/** Health */
export const healthApi = {
  check: () => api.get('/health'),
  ready: () => api.get('/health/ready'),
};

/** Verification (dev-only) */
export const verificationApi = {
  run: () => api.post('/verification/run'),
  status: () => api.get('/verification/status'),
};
