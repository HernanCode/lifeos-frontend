import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutos antes de refetch
      retry: 1,                      // 1 reintento en caso de error
      refetchOnWindowFocus: false,   // No refetch al cambiar de pestaña
    },
  },
});

export default queryClient;