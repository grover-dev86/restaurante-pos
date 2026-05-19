'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// ==========================================
// Schemas Zod
// ==========================================

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().or(z.literal('')),
  avatar: z.string().optional().or(z.literal('')),
})

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
      .max(100, 'La contraseña no puede tener más de 100 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type ProfileActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// ==========================================
// Lectura
// ==========================================

/**
 * Devuelve los datos del usuario autenticado más sus estadísticas:
 * - Conteo de ventas totales hechas como cajero
 * - Conteo de ventas del mes en curso
 * - Conteo de actividades, recepciones, ajustes y gastos
 */
export async function getMyProfile() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('No autenticado')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: { select: { id: true, name: true, displayName: true, description: true } },
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

  if (!user) throw new Error('Usuario no encontrado')

  // Ventas del mes en curso (solo completadas)
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const salesThisMonth = await prisma.sale.count({
    where: {
      cashierId: user.id,
      createdAt: { gte: startOfMonth },
      status: 'COMPLETED',
    },
  })

  return {
    ...user,
    password: undefined,
    twoFactorSecret: undefined,
    salesThisMonth,
  }
}

// ==========================================
// Mutaciones
// ==========================================

/**
 * Actualiza los datos básicos del usuario autenticado.
 * No permite cambiar el rol ni el estado isActive desde aquí (eso
 * requeriría ir a /users y tener permiso users:update).
 */
export async function updateMyProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: 'No autenticado' }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    avatar: (formData.get('avatar') as string) || undefined,
  }

  const validated = updateProfileSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const me = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!me) return { success: false, message: 'Usuario no encontrado' }

    // Si cambió el email, validar que no esté en uso por otro usuario
    if (validated.data.email !== me.email) {
      const inUse = await prisma.user.findUnique({
        where: { email: validated.data.email },
      })
      if (inUse) {
        return {
          success: false,
          message: 'El email ya está en uso',
          errors: { email: ['Este email ya está registrado'] },
        }
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone || null,
        avatar: validated.data.avatar || null,
      },
    })

    revalidatePath('/profile')
    return { success: true, message: 'Perfil actualizado correctamente' }
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return { success: false, message: 'Error al actualizar el perfil' }
  }
}

/**
 * Cambia la contraseña del usuario autenticado.
 * - Verifica la contraseña actual contra el hash con bcrypt
 * - Exige que la nueva sea distinta a la actual
 * - Aplica la misma política de fortaleza que el flow de reset
 */
export async function changeMyPassword(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: 'No autenticado' }

  const rawData = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validated = changePasswordSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const me = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!me) return { success: false, message: 'Usuario no encontrado' }

    // Verificar contraseña actual
    const isCurrentValid = await bcrypt.compare(
      validated.data.currentPassword,
      me.password
    )
    if (!isCurrentValid) {
      return {
        success: false,
        message: 'La contraseña actual es incorrecta',
        errors: { currentPassword: ['Contraseña incorrecta'] },
      }
    }

    // No permitir reutilizar la misma contraseña
    const isSamePassword = await bcrypt.compare(
      validated.data.newPassword,
      me.password
    )
    if (isSamePassword) {
      return {
        success: false,
        message: 'La nueva contraseña debe ser diferente a la actual',
        errors: { newPassword: ['Debe ser diferente a la contraseña actual'] },
      }
    }

    const hashedPassword = await bcrypt.hash(validated.data.newPassword, 12)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    // TODO: enviar email de notificación "tu contraseña fue cambiada"
    // (existe send-password-changed.ts del flow de reset, se puede reutilizar)

    return { success: true, message: 'Contraseña cambiada exitosamente' }
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return { success: false, message: 'Error al cambiar la contraseña' }
  }
}
