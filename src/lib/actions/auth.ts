'use server'

import { signIn } from '@/lib/auth'
import { loginSchema } from '@/lib/validations/auth'
import { AuthError } from 'next-auth'

// Rate limiting simple en memoria (en producción usar Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutos

function checkRateLimit(email: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(email)

  if (!attempt) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  // Resetear si pasó la ventana de tiempo
  if (now - attempt.lastAttempt > WINDOW_MS) {
    loginAttempts.delete(email)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  const remainingAttempts = MAX_ATTEMPTS - attempt.count
  return { allowed: attempt.count < MAX_ATTEMPTS, remainingAttempts: Math.max(0, remainingAttempts) }
}

function recordFailedAttempt(email: string): void {
  const now = Date.now()
  const attempt = loginAttempts.get(email)

  if (!attempt || now - attempt.lastAttempt > WINDOW_MS) {
    loginAttempts.set(email, { count: 1, lastAttempt: now })
  } else {
    loginAttempts.set(email, { count: attempt.count + 1, lastAttempt: now })
  }
}

function clearAttempts(email: string): void {
  loginAttempts.delete(email)
}

export type LoginState = {
  error?: string
  success?: boolean
  remainingAttempts?: number
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Validar datos del formulario
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    const firstError = errors.email?.[0] || errors.password?.[0] || 'Datos inválidos'
    return { error: firstError }
  }

  const { email, password } = validatedFields.data

  // Verificar rate limit
  const rateLimit = checkRateLimit(email)
  if (!rateLimit.allowed) {
    return {
      error: 'Demasiados intentos fallidos. Por favor, espera 15 minutos antes de intentar de nuevo.',
      remainingAttempts: 0,
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    // Login exitoso - limpiar intentos
    clearAttempts(email)
    return { success: true }
  } catch (error) {
    // Registrar intento fallido
    recordFailedAttempt(email)
    const { remainingAttempts: newRemainingAttempts } = checkRateLimit(email)

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Credenciales incorrectas. Verifica tu email y contraseña.',
            remainingAttempts: newRemainingAttempts,
          }
        default:
          return {
            error: 'Error al iniciar sesión. Por favor, intenta de nuevo.',
            remainingAttempts: newRemainingAttempts,
          }
      }
    }

    return {
      error: 'Error inesperado. Por favor, intenta de nuevo.',
      remainingAttempts: newRemainingAttempts,
    }
  }
}
