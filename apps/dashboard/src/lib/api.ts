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

/** Health */
export const healthApi = {
  check: () => api.get('/health'),
  ready: () => api.get('/health/ready'),
};
