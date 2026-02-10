import { resend } from './resend'
import { PasswordChangedEmail } from './templates/password-changed'

interface SendPasswordChangedEmailParams {
  email: string
  name: string
}

export async function sendPasswordChangedEmail({
  email,
  name,
}: SendPasswordChangedEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const loginLink = `${baseUrl}/login`

  // Sin API key configurada, solo mostramos en consola
  if (!resend) {
    console.warn('==========================================')
    console.warn('MODO DESARROLLO - Confirmación de cambio')
    console.warn('==========================================')
    console.warn(`Para: ${email}`)
    console.warn(`Nombre: ${name}`)
    console.warn(`Mensaje: Tu contraseña ha sido actualizada`)
    console.warn('==========================================')
    return { success: true, messageId: 'dev-mode' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Restaurante POS <onboarding@resend.dev>',
      to: email,
      subject: 'Tu contraseña ha sido actualizada - Restaurante POS',
      react: PasswordChangedEmail({ name, loginLink }),
    })

    if (error) {
      console.error('Error enviando email de confirmación:', error)
      throw new Error(error.message)
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error enviando email de confirmación de cambio:', error)
    throw error
  }
}
