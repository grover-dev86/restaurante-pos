'use client'

import { useSession } from 'next-auth/react'
import { checkPermission, type Action, type Resource } from '@/lib/rbac/check-permission'

/**
 * Hook del cliente para verificar permisos
 */
export function usePermission(resource: Resource, action: Action): boolean {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return false
  }

  return checkPermission(session.user.role, resource, action)
}

/**
 * Hook para obtener el usuario actual
 */
export function useCurrentUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  }
}

/**
 * Hook para verificar múltiples permisos
 */
export function usePermissions() {
  const { data: session } = useSession()

  const can = (resource: Resource, action: Action): boolean => {
    if (!session?.user?.role) {
      return false
    }
    return checkPermission(session.user.role, resource, action)
  }

  return { can }
}
