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
import { authApi, api } from './api';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface User {
  id: string;
  name: string;
  role: 'clinician' | 'admin';
  phone: string;
  clinicianRole?: string;
  permissions?: {
    canPrescribe: boolean;
    canExportResearch: boolean;
    canManageUsers: boolean;
  };
  department?: string;
  designation?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOtp: (phone: string) => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'pallicare_token';
const REFRESH_KEY = 'pallicare_refresh';
const USER_KEY = 'pallicare_user';

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
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
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  function clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const requestOtp = useCallback(async (phone: string) => {
    await authApi.requestOtp(phone);
  }, []);

  const login = useCallback(
    async (phone: string, otp: string) => {
      // In dev mode, bypass with 000000
      if (otp === '000000') {
        const devUser: User = {
          id: 'dev-clinician-001',
          name: 'Dr. Nikhil Nair',
          role: 'clinician',
          phone,
          clinicianRole: 'physician',
          permissions: {
            canPrescribe: true,
            canExportResearch: true,
            canManageUsers: false,
          },
          department: 'Palliative Care & Pain Management',
          designation: 'Assistant Professor',
        };
        const devToken = 'dev-jwt-token';

        localStorage.setItem(TOKEN_KEY, devToken);
        localStorage.setItem(USER_KEY, JSON.stringify(devUser));

        setState({
          user: devUser,
          token: devToken,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }

      // Real OTP verification
      const { data } = await authApi.verifyOtp(phone, otp);
      const { access_token, refresh_token, user } = data;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    clearStorage();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        requestOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Role Config Hook                                                    */
/* ------------------------------------------------------------------ */

import { getRoleConfig, type RoleConfig } from './role-config';

export function useRoleConfig(): RoleConfig {
  const { user } = useAuth();
  return getRoleConfig(user?.clinicianRole);
}
