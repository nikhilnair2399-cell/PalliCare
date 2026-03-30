import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// We test the api module by mocking axios and verifying the configuration
// and interceptor behavior applied in src/lib/api.ts.

// Mock axios.create to return a mock instance we can inspect
const mockRequestInterceptorUse = vi.fn();
const mockResponseInterceptorUse = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPatch = vi.fn();

const mockAxiosInstance = {
  interceptors: {
    request: { use: mockRequestInterceptorUse },
    response: { use: mockResponseInterceptorUse },
  },
  get: mockGet,
  post: mockPost,
  patch: mockPatch,
  defaults: {
    baseURL: '',
    headers: { common: {} },
  },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

describe('API Client (src/lib/api.ts)', () => {
  // Store original env and window
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    // Reset module registry so api.ts re-executes on each import
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ── Base URL Configuration ────────────────────────────────

  describe('base URL configuration', () => {
    it('should create axios instance with default base URL when env not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;

      await import('../lib/api');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:3001/api/v1',
        }),
      );
    });

    it('should use NEXT_PUBLIC_API_URL when set', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.pallicare.in/api/v1';

      await import('../lib/api');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.pallicare.in/api/v1',
        }),
      );
    });

    it('should set timeout to 15 seconds', async () => {
      await import('../lib/api');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 15_000,
        }),
      );
    });

    it('should set Content-Type header to application/json', async () => {
      await import('../lib/api');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });
  });

  // ── Request Interceptor (Auth Token Attachment) ───────────

  describe('request interceptor', () => {
    it('should register a request interceptor', async () => {
      await import('../lib/api');

      expect(mockRequestInterceptorUse).toHaveBeenCalledTimes(1);
      expect(mockRequestInterceptorUse).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should attach Bearer token from localStorage when available', async () => {
      await import('../lib/api');

      const requestInterceptor = mockRequestInterceptorUse.mock.calls[0][0];

      // Mock localStorage as a global (Node doesn't have it)
      const mockGetItem = vi.fn().mockReturnValue('test-jwt-token');
      const fakeStorage = { getItem: mockGetItem, setItem: vi.fn(), removeItem: vi.fn() };
      Object.defineProperty(globalThis, 'window', {
        value: { localStorage: fakeStorage },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(globalThis, 'localStorage', {
        value: fakeStorage,
        writable: true,
        configurable: true,
      });

      const config = { headers: {} as Record<string, string> };
      const result = requestInterceptor(config);

      expect(mockGetItem).toHaveBeenCalledWith('token');
      expect(result.headers.Authorization).toBe('Bearer test-jwt-token');

      // Cleanup
      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;
    });

    it('should not set Authorization header when no token in localStorage', async () => {
      await import('../lib/api');

      const requestInterceptor = mockRequestInterceptorUse.mock.calls[0][0];

      const fakeStorage = { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn(), removeItem: vi.fn() };
      Object.defineProperty(globalThis, 'window', {
        value: { localStorage: fakeStorage },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(globalThis, 'localStorage', {
        value: fakeStorage,
        writable: true,
        configurable: true,
      });

      const config = { headers: {} as Record<string, string> };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();

      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;
    });

    it('should not access localStorage in SSR (no window)', async () => {
      await import('../lib/api');

      const requestInterceptor = mockRequestInterceptorUse.mock.calls[0][0];

      // Ensure window is undefined (SSR)
      delete (globalThis as any).window;

      const config = { headers: {} as Record<string, string> };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  // ── Response Interceptor (Error Handling) ─────────────────

  describe('response interceptor', () => {
    it('should register a response interceptor with success and error handlers', async () => {
      await import('../lib/api');

      expect(mockResponseInterceptorUse).toHaveBeenCalledTimes(1);
      expect(mockResponseInterceptorUse).toHaveBeenCalledWith(
        expect.any(Function), // success handler
        expect.any(Function), // error handler
      );
    });

    it('should pass through successful responses unchanged', async () => {
      await import('../lib/api');

      const [successHandler] = mockResponseInterceptorUse.mock.calls[0];
      const mockResponse = { status: 200, data: { ok: true } };

      const result = successHandler(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should redirect to /login on 401 response', async () => {
      await import('../lib/api');

      const [, errorHandler] = mockResponseInterceptorUse.mock.calls[0];

      // Mock window.location
      const mockLocation = { href: '' };
      Object.defineProperty(globalThis, 'window', {
        value: { location: mockLocation },
        writable: true,
        configurable: true,
      });

      const error = { response: { status: 401 } };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(mockLocation.href).toBe('/login');

      delete (globalThis as any).window;
    });

    it('should not redirect on non-401 errors', async () => {
      await import('../lib/api');

      const [, errorHandler] = mockResponseInterceptorUse.mock.calls[0];

      const mockLocation = { href: '/current-page' };
      Object.defineProperty(globalThis, 'window', {
        value: { location: mockLocation },
        writable: true,
        configurable: true,
      });

      const error = { response: { status: 500, data: { message: 'Internal error' } } };

      await expect(errorHandler(error)).rejects.toEqual(error);
      expect(mockLocation.href).toBe('/current-page');

      delete (globalThis as any).window;
    });

    it('should not redirect on 401 in SSR (no window)', async () => {
      await import('../lib/api');

      const [, errorHandler] = mockResponseInterceptorUse.mock.calls[0];

      delete (globalThis as any).window;

      const error = { response: { status: 401 } };

      // Should reject without throwing about window
      await expect(errorHandler(error)).rejects.toEqual(error);
    });

    it('should reject with original error for network errors (no response)', async () => {
      await import('../lib/api');

      const [, errorHandler] = mockResponseInterceptorUse.mock.calls[0];

      const networkError = { message: 'Network Error', response: undefined };

      await expect(errorHandler(networkError)).rejects.toEqual(networkError);
    });
  });

  // ── API Function Exports ──────────────────────────────────

  describe('exported API functions', () => {
    it('should export authApi with OTP endpoints', async () => {
      const { authApi } = await import('../lib/api');

      expect(authApi).toBeDefined();
      expect(authApi.requestOtp).toBeInstanceOf(Function);
      expect(authApi.verifyOtp).toBeInstanceOf(Function);
      expect(authApi.refreshToken).toBeInstanceOf(Function);
    });

    it('should export patientsApi with clinician endpoints', async () => {
      const { patientsApi } = await import('../lib/api');

      expect(patientsApi).toBeDefined();
      expect(patientsApi.list).toBeInstanceOf(Function);
      expect(patientsApi.get).toBeInstanceOf(Function);
      expect(patientsApi.getSymptomLogs).toBeInstanceOf(Function);
      expect(patientsApi.getMedications).toBeInstanceOf(Function);
      expect(patientsApi.getPainTrends).toBeInstanceOf(Function);
    });

    it('should export alertsApi with lifecycle endpoints', async () => {
      const { alertsApi } = await import('../lib/api');

      expect(alertsApi).toBeDefined();
      expect(alertsApi.list).toBeInstanceOf(Function);
      expect(alertsApi.get).toBeInstanceOf(Function);
      expect(alertsApi.counts).toBeInstanceOf(Function);
      expect(alertsApi.acknowledge).toBeInstanceOf(Function);
      expect(alertsApi.resolve).toBeInstanceOf(Function);
      expect(alertsApi.escalate).toBeInstanceOf(Function);
    });

    it('should export analyticsApi with dashboard endpoints', async () => {
      const { analyticsApi } = await import('../lib/api');

      expect(analyticsApi).toBeDefined();
      expect(analyticsApi.departmentSummary).toBeInstanceOf(Function);
      expect(analyticsApi.painDistribution).toBeInstanceOf(Function);
      expect(analyticsApi.medicationAdherence).toBeInstanceOf(Function);
      expect(analyticsApi.meddDistribution).toBeInstanceOf(Function);
      expect(analyticsApi.qualityMetrics).toBeInstanceOf(Function);
    });

    it('should export healthApi for status checks', async () => {
      const { healthApi } = await import('../lib/api');

      expect(healthApi).toBeDefined();
      expect(healthApi.check).toBeInstanceOf(Function);
      expect(healthApi.ready).toBeInstanceOf(Function);
    });

    it('should export notificationsApi', async () => {
      const { notificationsApi } = await import('../lib/api');

      expect(notificationsApi).toBeDefined();
      expect(notificationsApi.list).toBeInstanceOf(Function);
      expect(notificationsApi.unreadCount).toBeInstanceOf(Function);
      expect(notificationsApi.markAsRead).toBeInstanceOf(Function);
      expect(notificationsApi.markAllAsRead).toBeInstanceOf(Function);
    });
  });

  // ── Auth API Function Calls ───────────────────────────────

  describe('authApi calls', () => {
    it('should call POST /auth/otp/request for requestOtp', async () => {
      const { authApi } = await import('../lib/api');

      authApi.requestOtp('+919876543210');

      expect(mockPost).toHaveBeenCalledWith('/auth/otp/request', {
        phone: '+919876543210',
      });
    });

    it('should call POST /auth/otp/verify for verifyOtp', async () => {
      const { authApi } = await import('../lib/api');

      authApi.verifyOtp('+919876543210', '123456');

      expect(mockPost).toHaveBeenCalledWith('/auth/otp/verify', {
        phone: '+919876543210',
        otp: '123456',
      });
    });

    it('should call POST /auth/token/refresh for refreshToken', async () => {
      const { authApi } = await import('../lib/api');

      authApi.refreshToken('my-refresh-token');

      expect(mockPost).toHaveBeenCalledWith('/auth/token/refresh', {
        refresh_token: 'my-refresh-token',
      });
    });
  });

  // ── Alerts API Function Calls ─────────────────────────────

  describe('alertsApi calls', () => {
    it('should call PATCH for acknowledge', async () => {
      const { alertsApi } = await import('../lib/api');

      alertsApi.acknowledge('alert-123');

      expect(mockPatch).toHaveBeenCalledWith('/clinical-alerts/alert-123/acknowledge');
    });

    it('should call PATCH for resolve with notes', async () => {
      const { alertsApi } = await import('../lib/api');

      alertsApi.resolve('alert-123', 'Pain managed');

      expect(mockPatch).toHaveBeenCalledWith(
        '/clinical-alerts/alert-123/resolve',
        { notes: 'Pain managed' },
      );
    });

    it('should call POST for escalate', async () => {
      const { alertsApi } = await import('../lib/api');

      alertsApi.escalate('alert-123', 'senior-doc-1');

      expect(mockPost).toHaveBeenCalledWith(
        '/clinical-alerts/alert-123/escalate',
        { escalate_to: 'senior-doc-1' },
      );
    });
  });
});
