import { QueryClient } from '@tanstack/react-query';

export const useQueryClientDefaults = () => {
  // Read ENV variable (default to false if not set)
  const ENABLE_CACHING = import.meta.env.VITE_ENABLE_CACHING === 'true';

  const DEFAULT_STALE_TIME = 10 * 60 * 1000; // stale time 10 minutes
  const DEFAULT_GC_TIME = 15 * 60 * 1000; // garbage collection 15 minutes

  // Set caching values only if enabled
  const STALE_TIME = ENABLE_CACHING
    ? Number(import.meta.env.VITE_REACT_QUERY_STALE_TIME) || DEFAULT_STALE_TIME
    : 0;
  const GC_TIME = ENABLE_CACHING
    ? Number(import.meta.env.VITE_REACT_QUERY_GC_TIME) || DEFAULT_GC_TIME
    : 0;

  type QueriesType = {
    refetchOnWindowFocus: boolean;
    staleTime?: number;
    gcTime?: number;
  };

  const queries: QueriesType = {
    refetchOnWindowFocus: false,
  };

  // if enable will add these custom options to all queries
  // else defaults staleTime will be 0 and gcTime will be 5mins.
  if (ENABLE_CACHING) {
    queries.staleTime = STALE_TIME;
    queries.gcTime = GC_TIME;
  }
  // If caching is disabled, always refetch,
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: queries,
    },
  });

  return queryClient;
};
