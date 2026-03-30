'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { patientAuthApi, patientApi } from './patient-api';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface PatientUser {
  id: string;
  name: string;
  phone: string;
  uhid: string;
  preferred_language: 'en' | 'hi';
}

interface PatientAuthState {
  user: PatientUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

interface PatientAuthContextValue extends PatientAuthState {
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<void>;
  completeOnboarding: () => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const PatientAuthContext = createContext<PatientAuthContextValue | null>(null);

const TOKEN_KEY = 'patient_token';
const REFRESH_KEY = 'patient_refresh';
const USER_KEY = 'patient_user';
const ONBOARDING_KEY = 'patient_onboarding_complete';

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function PatientAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<PatientAuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    isOnboarded: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as PatientUser;
        const onboarded = localStorage.getItem(ONBOARDING_KEY) === 'true';
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
          isOnboarded: onboarded,
        });
      } catch {
        clearStorage();
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  // Update axios default header when token changes
  useEffect(() => {
    if (state.token) {
      patientApi.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete patientApi.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  function clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const requestOtp = useCallback(async (phone: string) => {
    await patientAuthApi.requestOtp(phone);
  }, []);

  const login = useCallback(
    async (phone: string, otp: string) => {
      // Dev bypass: 000000
      if (otp === '000000') {
        const devUser: PatientUser = {
          id: 'dev-patient-001',
          name: 'Rajesh Kumar',
          phone,
          uhid: 'AIIMS-BPL-2024-001234',
          preferred_language: 'en',
        };
        const devToken = 'dev-patient-jwt-token';

        localStorage.setItem(TOKEN_KEY, devToken);
        localStorage.setItem(USER_KEY, JSON.stringify(devUser));

        const onboarded = localStorage.getItem(ONBOARDING_KEY) === 'true';
        setState({
          user: devUser,
          token: devToken,
          isLoading: false,
          isAuthenticated: true,
          isOnboarded: onboarded,
        });
        return;
      }

      // Real OTP verification
      const { data } = await patientAuthApi.verifyOtp(phone, otp);
      const { access_token, refresh_token, user } = data;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      const onboarded = localStorage.getItem(ONBOARDING_KEY) === 'true';
      setState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
        isOnboarded: onboarded,
      });
    },
    [],
  );

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setState((s) => ({ ...s, isOnboarded: true }));
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isOnboarded: false,
    });
    router.push('/patient/login');
  }, [router]);

  return (
    <PatientAuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        requestOtp,
        completeOnboarding,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function usePatientAuth() {
  const ctx = useContext(PatientAuthContext);
  if (!ctx) {
    throw new Error('usePatientAuth must be used within PatientAuthProvider');
  }
  return ctx;
}
