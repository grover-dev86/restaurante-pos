'use client'

import { usePermissions } from '@/hooks/use-permissions'
import type { Action, Resource } from '@/lib/rbac'
import { ReactNode } from 'react'

interface PermissionGateProps {
  children: ReactNode
  /** Recurso a verificar */
  resource: Resource
  /** Acción a verificar */
  action: Action
  /** Contenido alternativo si no tiene permiso */
  fallback?: ReactNode
  /** Si es true, muestra loading mientras carga la sesión */
  showLoading?: boolean
}

/**
 * Componente que muestra su contenido solo si el usuario tiene el permiso requerido
 */
export function PermissionGate({
  children,
  resource,
  action,
  fallback = null,
  showLoading = false,
}: PermissionGateProps) {
  const { can, isLoading } = usePermissions()

  if (isLoading && showLoading) {
    return <div className="animate-pulse bg-muted h-8 rounded" />
  }

  if (isLoading) {
    return null
  }

  if (!can(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface PermissionGateAnyProps {
  children: ReactNode
  /** Lista de permisos, se muestra si tiene al menos uno */
  permissions: Array<{ resource: Resource; action: Action }>
  fallback?: ReactNode
  showLoading?: boolean
}

/**
 * Componente que muestra su contenido si el usuario tiene AL MENOS UNO de los permisos
 */
export function PermissionGateAny({
  children,
  permissions,
  fallback = null,
  showLoading = false,
}: PermissionGateAnyProps) {
  const { canAny, isLoading } = usePermissions()

  if (isLoading && showLoading) {
    return <div className="animate-pulse bg-muted h-8 rounded" />
  }

  if (isLoading) {
    return null
  }

  if (!canAny(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que muestra su contenido solo para administradores
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin, isLoading } = usePermissions()

  if (isLoading) {
    return null
  }

  if (!isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Componente que muestra su contenido para gerentes y administradores
 */
export function ManagerOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isManager, isLoading } = usePermissions()

  if (isLoading) {
    return null
  }

  if (!isManager) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
