'use server'

import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { sendPasswordResetEmail } from '@/lib/email/send-password-reset'

export type ForgotPasswordState = {
  success?: boolean
  message?: string
  error?: string
  errors?: {
    email?: string
  }
}

export type ResetPasswordState = {
  success?: boolean
  message?: string
  error?: string
  errors?: {
    token?: string
    password?: string
    confirmPassword?: string
  }
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const rawData = {
    email: formData.get('email'),
  }

  // Validar datos
  const validatedFields = forgotPasswordSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return {
      errors: {
        email: fieldErrors.email?.[0],
      },
    }
  }

  const { email } = validatedFields.data

  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Por seguridad, siempre devolvemos el mismo mensaje
    // para no revelar si el email existe o no
    if (!user) {
      return {
        success: true,
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación.',
      }
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return {
        success: true,
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación.',
      }
    }

    // Invalidar tokens anteriores del usuario
    await prisma.passwordResetToken.updateMany({
      where: {
        email: email.toLowerCase(),
        used: false,
      },
      data: {
        used: true,
      },
    })

    // Generar token único
    const token = randomBytes(32).toString('hex')

    // Crear token de recuperación (expira en 1 hora)
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
      },
    })

    // Enviar email con el enlace de recuperación
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token,
    })

    return {
      success: true,
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación.',
    }
  } catch (error) {
    console.error('Error en requestPasswordReset:', error)
    return {
      error: 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.',
    }
  }
}

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const rawData = {
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  // Validar datos
  const validatedFields = resetPasswordSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return {
      errors: {
        token: fieldErrors.token?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
    }
  }

  const { token, password } = validatedFields.data

  try {
    // Buscar el token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    // Validar token
    if (!resetToken) {
      return {
        error: 'El enlace de recuperación es inválido o ha expirado.',
      }
    }

    if (resetToken.used) {
      return {
        error: 'Este enlace ya fue utilizado. Solicita uno nuevo.',
      }
    }

    if (resetToken.expiresAt < new Date()) {
      return {
        error: 'El enlace de recuperación ha expirado. Solicita uno nuevo.',
      }
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    })

    if (!user) {
      return {
        error: 'No se encontró el usuario asociado a este enlace.',
      }
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Actualizar contraseña y marcar token como usado
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return {
      success: true,
      message: 'Tu contraseña ha sido actualizada exitosamente.',
    }
  } catch (error) {
    console.error('Error en resetPassword:', error)
    return {
      error: 'Ocurrió un error al actualizar tu contraseña. Intenta de nuevo más tarde.',
    }
  }
}
