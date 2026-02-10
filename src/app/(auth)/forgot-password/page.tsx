import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { ForgotPasswordForm } from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | Restaurante POS',
  description: 'Recupera el acceso a tu cuenta',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      description="Ingresa tu email y te enviaremos un enlace para restablecerla"
      footerLink={{
        text: '← Volver al inicio de sesión',
        href: '/login',
      }}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
