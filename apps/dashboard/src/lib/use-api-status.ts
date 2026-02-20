'use client';

import { useQuery } from '@tanstack/react-query';
import { healthApi } from './api';

/**
 * Tracks whether the API backend is reachable.
 *
 * Returns:
 *  - isOnline: true when API responds to health check
 *  - isChecking: true during initial check
 *  - error: error object if backend unreachable
 *
 * Polls every 60 seconds. Silent retry — no toast on failure.
 */
export function useApiStatus() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      const { data } = await healthApi.check();
      return data;
    },
    refetchInterval: 60_000,
    retry: 1,
    retryDelay: 3000,
    // Don't throw to the error boundary
    throwOnError: false,
  });

  return {
    isOnline: !!data && !isError,
    isChecking: isLoading,
    isError,
    error,
    status: isLoading
      ? ('connecting' as const)
      : isError
        ? ('disconnected' as const)
        : ('connected' as const),
  };
}

/**
 * Hook for graceful data fetching with mock data fallback.
 *
 * When the API is unreachable (e.g. Docker not running), pages
 * can render with mock data instead of showing an error state.
 *
 * @example
 * const { data, isFromApi } = useWithFallback(
 *   usePatients(),       // real API query
 *   MOCK_PATIENTS,       // fallback data
 * );
 */
export function useWithFallback<T>(
  query: {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  },
  fallback: T,
): { data: T; isLoading: boolean; isFromApi: boolean } {
  if (query.isLoading) {
    return { data: fallback, isLoading: true, isFromApi: false };
  }
  if (query.isError || query.data === undefined) {
    return { data: fallback, isLoading: false, isFromApi: false };
  }
  return { data: query.data, isLoading: false, isFromApi: true };
}
