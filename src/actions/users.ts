'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import { z } from 'zod'
import { hash } from 'bcryptjs'

// Schema de validación para crear usuario
const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres'),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Debe seleccionar un rol'),
  avatar: z.string().optional(),
})

// Schema de validación para editar usuario
const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Debe seleccionar un rol'),
  avatar: z.string().optional(),
})

export type UserActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// Obtener todos los usuarios (filtrado en cliente para búsqueda instantánea)
export async function getAllUsers() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'users', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver usuarios')

  const users = await prisma.user.findMany({
    include: {
      role: {
        select: { id: true, name: true, displayName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return users.map((u) => ({
    ...u,
    password: undefined,
    twoFactorSecret: undefined,
  }))
}

// Obtener un usuario por ID
export async function getUserById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'users', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver usuarios')

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: { select: { id: true, name: true, displayName: true } },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!user) return null

  return {
    ...user,
    password: undefined,
    twoFactorSecret: undefined,
  }
}

// Obtener roles disponibles para select
export async function getRolesForSelect() {
  const roles = await prisma.role.findMany({
    select: { id: true, name: true, displayName: true },
    orderBy: { createdAt: 'asc' },
  })
  return roles
}

// Crear usuario
export async function createUser(
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canCreate = checkPermission(session.user.role || '', 'users', 'create')
  if (!canCreate) return { success: false, message: 'No tienes permiso para crear usuarios' }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phone: (formData.get('phone') as string) || undefined,
    roleId: formData.get('roleId') as string,
    avatar: (formData.get('avatar') as string) || undefined,
  }

  const validatedData = createUserSchema.safeParse(rawData)
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    // Verificar email único
    const existing = await prisma.user.findUnique({
      where: { email: validatedData.data.email },
    })
    if (existing) {
      return {
        success: false,
        message: 'El email ya está en uso',
        errors: { email: ['Este email ya está registrado'] },
      }
    }

    // Hash de contraseña
    const hashedPassword = await hash(validatedData.data.password, 12)

    await prisma.user.create({
      data: {
        name: validatedData.data.name,
        email: validatedData.data.email,
        password: hashedPassword,
        phone: validatedData.data.phone,
        roleId: validatedData.data.roleId,
        avatar: validatedData.data.avatar || null,
      },
    })

    revalidatePath('/users')
    return { success: true, message: 'Usuario creado exitosamente' }
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return { success: false, message: 'Error al crear el usuario' }
  }
}

// Actualizar usuario
export async function updateUser(
  id: string,
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'users', 'update')
  if (!canUpdate) return { success: false, message: 'No tienes permiso para editar usuarios' }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: (formData.get('password') as string) || undefined,
    phone: (formData.get('phone') as string) || undefined,
    roleId: formData.get('roleId') as string,
    avatar: (formData.get('avatar') as string) || undefined,
  }

  const validatedData = updateUserSchema.safeParse(rawData)
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) return { success: false, message: 'Usuario no encontrado' }

    // Verificar email único si cambió
    if (validatedData.data.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: validatedData.data.email },
      })
      if (emailInUse) {
        return {
          success: false,
          message: 'El email ya está en uso',
          errors: { email: ['Este email ya está registrado'] },
        }
      }
    }

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {
      name: validatedData.data.name,
      avatar: validatedData.data.avatar || null,
      email: validatedData.data.email,
      phone: validatedData.data.phone,
      roleId: validatedData.data.roleId,
    }

    // Solo actualizar contraseña si se proporcionó una nueva
    if (validatedData.data.password && validatedData.data.password.length > 0) {
      updateData.password = await hash(validatedData.data.password, 12)
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/users')
    return { success: true, message: 'Usuario actualizado exitosamente' }
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return { success: false, message: 'Error al actualizar el usuario' }
  }
}

// Activar/desactivar usuario
export async function toggleUserActive(id: string): Promise<UserActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'users', 'update')
  if (!canUpdate) return { success: false, message: 'No tienes permiso para modificar usuarios' }

  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { success: false, message: 'Usuario no encontrado' }

    // No permitir desactivar al propio usuario
    if (user.id === session.user.id) {
      return { success: false, message: 'No puedes desactivar tu propia cuenta' }
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    })

    revalidatePath('/users')
    return {
      success: true,
      message: user.isActive ? 'Usuario desactivado' : 'Usuario activado',
    }
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
    return { success: false, message: 'Error al cambiar estado del usuario' }
  }
}

// Eliminar usuario permanentemente
export async function deleteUser(id: string): Promise<UserActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canDelete = checkPermission(session.user.role || '', 'users', 'delete')
  if (!canDelete) return { success: false, message: 'No tienes permiso para eliminar usuarios' }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            sales: true,
            activities: true,
            receivings: true,
            adjustments: true,
            expenses: true,
          },
        },
      },
    })
    if (!user) return { success: false, message: 'Usuario no encontrado' }

    // No permitir eliminarse a sí mismo
    if (user.id === session.user.id) {
      return { success: false, message: 'No puedes eliminar tu propia cuenta' }
    }

    // Verificar si tiene registros relacionados
    const totalRelations =
      user._count.sales +
      user._count.activities +
      user._count.receivings +
      user._count.adjustments +
      user._count.expenses

    if (totalRelations > 0) {
      return {
        success: false,
        message: `No se puede eliminar porque tiene ${totalRelations} registro(s) asociados (ventas, actividades, etc.). Desactívalo en su lugar.`,
      }
    }

    // Eliminar notificaciones del usuario primero (no tienen impacto en el negocio)
    await prisma.notification.deleteMany({ where: { userId: id } })

    // Eliminar usuario permanentemente
    await prisma.user.delete({ where: { id } })

    revalidatePath('/users')
    return { success: true, message: 'Usuario eliminado permanentemente' }
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return { success: false, message: 'Error al eliminar el usuario' }
  }
}
