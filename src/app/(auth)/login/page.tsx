import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Restaurante POS',
  description: 'Inicia sesión en el sistema de punto de venta',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      description="Ingresa tus credenciales para acceder al sistema"
      footerLink={{
        text: '¿Olvidaste tu contraseña?',
        href: '/forgot-password',
      }}
    >
      <LoginForm />
    </AuthLayout>
  )
}
