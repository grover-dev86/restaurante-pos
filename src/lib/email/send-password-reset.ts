import { resend } from './resend'
import { PasswordResetEmail } from './templates/password-reset'

interface SendPasswordResetEmailParams {
  email: string
  name: string
  token: string
}

export async function sendPasswordResetEmail({ email, name, token }: SendPasswordResetEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/reset-password/${token}`

  // Sin API key configurada, solo mostramos el link en consola
  if (!resend) {
    console.warn('========================================')
    console.warn('MODO DESARROLLO - Email de recuperación')
    console.warn('========================================')
    console.warn(`Para: ${email}`)
    console.warn(`Nombre: ${name}`)
    console.warn(`Link: ${resetLink}`)
    console.warn('========================================')
    return { success: true, messageId: 'dev-mode' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Restaurante POS <onboarding@resend.dev>',
      to: email,
      subject: 'Restablece tu contraseña - Restaurante POS',
      react: PasswordResetEmail({ name, resetLink }),
    })

    if (error) {
      console.error('Error enviando email:', error)
      throw new Error(error.message)
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error enviando email de recuperación:', error)
    throw error
  }
}
