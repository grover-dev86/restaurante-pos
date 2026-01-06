import { auth } from '@/lib/auth'
import { checkPermission, type Action, type Resource } from './check-permission'
import { redirect } from 'next/navigation'

/**
 * Hook del servidor para verificar permisos
 * Lanza un error 403 si no tiene permisos
 */
export async function requirePermission(resource: Resource, action: Action) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const hasPermission = checkPermission(session.user.role, resource, action)

  if (!hasPermission) {
    throw new Error('Forbidden: You do not have permission to perform this action')
  }

  return session.user
}

/**
 * Verifica permisos en el servidor sin lanzar error
 * Retorna true/false
 */
export async function hasPermission(resource: Resource, action: Action): Promise<boolean> {
  const session = await auth()

  if (!session?.user) {
    return false
  }

  return checkPermission(session.user.role, resource, action)
}

/**
 * Obtiene la sesión del usuario actual
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}
