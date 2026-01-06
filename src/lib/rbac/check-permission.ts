import { ROLE_PERMISSIONS, type Action, type Resource, type RoleName } from './permissions'

/**
 * Verifica si un rol tiene permiso para realizar una acción en un recurso
 */
export function checkPermission(role: string, resource: Resource, action: Action): boolean {
  // Si el rol no existe, denegar acceso
  if (!ROLE_PERMISSIONS[role as RoleName]) {
    return false
  }

  const rolePermissions = ROLE_PERMISSIONS[role as RoleName]
  const resourcePermissions = rolePermissions[resource]

  // Si el recurso no está definido para este rol, denegar acceso
  if (!resourcePermissions) {
    return false
  }

  // Verificar si la acción está permitida
  return resourcePermissions.includes(action)
}

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 */
export function checkAnyPermission(
  role: string,
  permissions: Array<{ resource: Resource; action: Action }>
): boolean {
  return permissions.some((perm) => checkPermission(role, perm.resource, perm.action))
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 */
export function checkAllPermissions(
  role: string,
  permissions: Array<{ resource: Resource; action: Action }>
): boolean {
  return permissions.every((perm) => checkPermission(role, perm.resource, perm.action))
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: string) {
  if (!ROLE_PERMISSIONS[role as RoleName]) {
    return {}
  }

  return ROLE_PERMISSIONS[role as RoleName]
}

/**
 * Obtiene los permisos de un rol para un recurso específico
 */
export function getResourcePermissions(role: string, resource: Resource): Action[] {
  if (!ROLE_PERMISSIONS[role as RoleName]) {
    return []
  }

  const rolePermissions = ROLE_PERMISSIONS[role as RoleName]
  return rolePermissions[resource] || []
}
