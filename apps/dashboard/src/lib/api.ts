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

/** Patients */
export const patientsApi = {
  list: (params?: { status?: string; search?: string }) =>
    api.get('/patients', { params }),
  get: (id: string) => api.get(`/patients/${id}`),
  getSymptomLogs: (id: string, params?: { from?: string; to?: string }) =>
    api.get(`/patients/${id}/symptom-logs`, { params }),
  getMedications: (id: string) => api.get(`/patients/${id}/medications`),
  getPainTrends: (id: string, days?: number) =>
    api.get(`/patients/${id}/pain-trends`, { params: { days: days || 30 } }),
};

/** Alerts */
export const alertsApi = {
  list: (params?: { priority?: string; acknowledged?: boolean }) =>
    api.get('/clinical-alerts', { params }),
  acknowledge: (id: string) =>
    api.patch(`/clinical-alerts/${id}/acknowledge`),
  escalate: (id: string) =>
    api.post(`/clinical-alerts/${id}/escalate`),
};

/** Analytics */
export const analyticsApi = {
  departmentSummary: () => api.get('/analytics/department-summary'),
  painDistribution: () => api.get('/analytics/pain-distribution'),
  medicationAdherence: () => api.get('/analytics/medication-adherence'),
};
