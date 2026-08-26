import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/database.types'
import { Skeleton } from '@/components/ui'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-dvh bg-bg-base flex items-center justify-center px-5">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
