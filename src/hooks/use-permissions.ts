'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  getRolePermissions,
  type Action,
  type Resource,
} from '@/lib/rbac'

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
  const { data: session, status } = useSession()

  const role = session?.user?.role || ''

  const permissions = useMemo(() => {
    return getRolePermissions(role)
  }, [role])

  /**
   * Verifica si el usuario tiene permiso para una acción en un recurso
   */
  const can = (resource: Resource, action: Action): boolean => {
    if (!role) return false
    return checkPermission(role, resource, action)
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos
   */
  const canAny = (perms: Array<{ resource: Resource; action: Action }>): boolean => {
    if (!role) return false
    return checkAnyPermission(role, perms)
  }

  /**
   * Verifica si el usuario tiene todos los permisos
   */
  const canAll = (perms: Array<{ resource: Resource; action: Action }>): boolean => {
    if (!role) return false
    return checkAllPermissions(role, perms)
  }

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = role.toUpperCase() === 'ADMIN'

  /**
   * Verifica si el usuario es gerente o superior
   */
  const isManager = ['ADMIN', 'MANAGER'].includes(role.toUpperCase())

  return {
    role,
    permissions,
    can,
    canAny,
    canAll,
    isAdmin,
    isManager,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
