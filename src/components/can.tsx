'use client'

import { usePermission } from '@/hooks/use-permission'
import { type Action, type Resource } from '@/lib/rbac/check-permission'

interface CanProps {
  resource: Resource
  action: Action
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente para renderizado condicional basado en permisos
 */
export function Can({ resource, action, children, fallback = null }: CanProps) {
  const hasPermission = usePermission(resource, action)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Componente inverso - renderiza si NO tiene permiso
 */
export function Cannot({ resource, action, children }: CanProps) {
  const hasPermission = usePermission(resource, action)

  if (hasPermission) {
    return null
  }

  return <>{children}</>
}
