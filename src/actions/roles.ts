'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import { z } from 'zod'

// Schema de validación para crear/editar rol
const roleSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[A-Z_]+$/, 'El nombre debe estar en mayúsculas y sin espacios (ej: ADMIN_ROLE)'),
  displayName: z
    .string()
    .min(2, 'El nombre visible debe tener al menos 2 caracteres')
    .max(100, 'El nombre visible no puede tener más de 100 caracteres'),
  description: z.string().max(500, 'La descripción no puede tener más de 500 caracteres').optional(),
  permissionIds: z.array(z.string()).optional(),
})

export type RoleFormData = z.infer<typeof roleSchema>

// Tipos de estado para las acciones
export type RoleActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// Obtener todos los roles con sus permisos
export async function getRoles() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const canRead = checkPermission(session.user.role || '', 'roles', 'read')
  if (!canRead) {
    throw new Error('No tienes permiso para ver los roles')
  }

  const roles = await prisma.role.findMany({
    include: {
      permissions: true,
      _count: {
        select: { users: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return roles
}

// Obtener un rol por ID
export async function getRoleById(id: string) {
  const session = await auth()

  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const canRead = checkPermission(session.user.role || '', 'roles', 'read')
  if (!canRead) {
    throw new Error('No tienes permiso para ver los roles')
  }

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: true,
      _count: {
        select: { users: true },
      },
    },
  })

  return role
}

// Obtener todos los permisos disponibles
export async function getPermissions() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('No autorizado')
  }

  const canRead = checkPermission(session.user.role || '', 'roles', 'read')
  if (!canRead) {
    throw new Error('No tienes permiso para ver los permisos')
  }

  const permissions = await prisma.permission.findMany({
    orderBy: [{ resource: 'asc' }, { action: 'asc' }],
  })

  return permissions
}

// Crear un nuevo rol
export async function createRole(
  _prevState: RoleActionState,
  formData: FormData
): Promise<RoleActionState> {
  const session = await auth()

  if (!session?.user) {
    return { success: false, message: 'No autorizado' }
  }

  const canCreate = checkPermission(session.user.role || '', 'roles', 'create')
  if (!canCreate) {
    return { success: false, message: 'No tienes permiso para crear roles' }
  }

  // Extraer datos del formulario
  const rawData = {
    name: formData.get('name') as string,
    displayName: formData.get('displayName') as string,
    description: formData.get('description') as string || undefined,
    permissionIds: formData.getAll('permissionIds') as string[],
  }

  // Validar datos
  const validatedData = roleSchema.safeParse(rawData)
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findUnique({
      where: { name: validatedData.data.name },
    })

    if (existingRole) {
      return {
        success: false,
        message: 'Ya existe un rol con ese nombre',
        errors: { name: ['Este nombre de rol ya está en uso'] },
      }
    }

    // Crear el rol
    await prisma.role.create({
      data: {
        name: validatedData.data.name,
        displayName: validatedData.data.displayName,
        description: validatedData.data.description,
        permissions: {
          connect: validatedData.data.permissionIds?.map((id) => ({ id })) || [],
        },
      },
    })

    revalidatePath('/roles')
    return { success: true, message: 'Rol creado exitosamente' }
  } catch (error) {
    console.error('Error al crear rol:', error)
    return { success: false, message: 'Error al crear el rol' }
  }
}

// Actualizar un rol existente
export async function updateRole(
  id: string,
  _prevState: RoleActionState,
  formData: FormData
): Promise<RoleActionState> {
  const session = await auth()

  if (!session?.user) {
    return { success: false, message: 'No autorizado' }
  }

  const canUpdate = checkPermission(session.user.role || '', 'roles', 'update')
  if (!canUpdate) {
    return { success: false, message: 'No tienes permiso para editar roles' }
  }

  // Extraer datos del formulario
  const rawData = {
    name: formData.get('name') as string,
    displayName: formData.get('displayName') as string,
    description: formData.get('description') as string || undefined,
    permissionIds: formData.getAll('permissionIds') as string[],
  }

  // Validar datos
  const validatedData = roleSchema.safeParse(rawData)
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: { id },
    })

    if (!existingRole) {
      return { success: false, message: 'Rol no encontrado' }
    }

    // Verificar si el nuevo nombre ya está en uso por otro rol
    if (validatedData.data.name !== existingRole.name) {
      const nameInUse = await prisma.role.findUnique({
        where: { name: validatedData.data.name },
      })
      if (nameInUse) {
        return {
          success: false,
          message: 'Ya existe un rol con ese nombre',
          errors: { name: ['Este nombre de rol ya está en uso'] },
        }
      }
    }

    // Actualizar el rol
    await prisma.role.update({
      where: { id },
      data: {
        name: validatedData.data.name,
        displayName: validatedData.data.displayName,
        description: validatedData.data.description,
        permissions: {
          set: validatedData.data.permissionIds?.map((id) => ({ id })) || [],
        },
      },
    })

    revalidatePath('/roles')
    return { success: true, message: 'Rol actualizado exitosamente' }
  } catch (error) {
    console.error('Error al actualizar rol:', error)
    return { success: false, message: 'Error al actualizar el rol' }
  }
}

// Eliminar un rol
export async function deleteRole(id: string): Promise<RoleActionState> {
  const session = await auth()

  if (!session?.user) {
    return { success: false, message: 'No autorizado' }
  }

  const canDelete = checkPermission(session.user.role || '', 'roles', 'delete')
  if (!canDelete) {
    return { success: false, message: 'No tienes permiso para eliminar roles' }
  }

  try {
    // Verificar si el rol existe
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    })

    if (!role) {
      return { success: false, message: 'Rol no encontrado' }
    }

    // No permitir eliminar roles del sistema
    const systemRoles = ['ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'USER']
    if (systemRoles.includes(role.name)) {
      return { success: false, message: 'No se pueden eliminar roles del sistema' }
    }

    // No permitir eliminar si hay usuarios asignados
    if (role._count.users > 0) {
      return {
        success: false,
        message: `No se puede eliminar el rol porque tiene ${role._count.users} usuario(s) asignado(s)`,
      }
    }

    // Eliminar el rol
    await prisma.role.delete({
      where: { id },
    })

    revalidatePath('/roles')
    return { success: true, message: 'Rol eliminado exitosamente' }
  } catch (error) {
    console.error('Error al eliminar rol:', error)
    return { success: false, message: 'Error al eliminar el rol' }
  }
}
