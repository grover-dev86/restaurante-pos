import { ROLE_PERMISSIONS, type Action, type Resource, type RoleName } from './permissions'

// Re-exportar tipos para uso externo
export type { Action, Resource, RoleName }

// Tipo para los permisos de un rol
type RolePermissionsMap = Partial<Record<Resource, readonly Action[]>>

/**
 * Verifica si un rol tiene permiso para realizar una acción en un recurso
 */
export function checkPermission(role: string, resource: Resource, action: Action): boolean {
  // Si el rol no existe, denegar acceso
  const roleKey = role.toUpperCase() as RoleName
  if (!(roleKey in ROLE_PERMISSIONS)) {
    return false
  }

  const rolePermissions = ROLE_PERMISSIONS[roleKey] as RolePermissionsMap
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
export function getRolePermissions(role: string): RolePermissionsMap {
  const roleKey = role.toUpperCase() as RoleName
  if (!(roleKey in ROLE_PERMISSIONS)) {
    return {}
  }

  return ROLE_PERMISSIONS[roleKey] as RolePermissionsMap
}

/**
 * Obtiene los permisos de un rol para un recurso específico
 */
export function getResourcePermissions(role: string, resource: Resource): readonly Action[] {
  const roleKey = role.toUpperCase() as RoleName
  if (!(roleKey in ROLE_PERMISSIONS)) {
    return []
  }

  const rolePermissions = ROLE_PERMISSIONS[roleKey] as RolePermissionsMap
  return rolePermissions[resource] || []
}
