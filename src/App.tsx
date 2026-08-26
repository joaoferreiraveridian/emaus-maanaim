import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/modules/auth/AuthProvider'
import { AppRouter } from '@/routes/AppRouter'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  )
}
