import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { ResetPasswordForm } from './reset-password-form'
import { prisma } from '@/lib/prisma'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ShieldX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | Restaurante POS',
  description: 'Establece tu nueva contraseña',
}

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params

  // Verificar si el token es válido
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  const isValidToken = resetToken && !resetToken.used && resetToken.expiresAt > new Date()

  if (!isValidToken) {
    return (
      <AuthLayout
        title="Enlace no válido"
        description="El enlace de recuperación no es válido o ha expirado"
        footerLink={{
          text: '← Volver al inicio de sesión',
          href: '/login',
        }}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {resetToken?.used
                ? 'Este enlace ya fue utilizado para restablecer la contraseña.'
                : resetToken
                  ? 'Este enlace ha expirado. Los enlaces son válidos por 1 hora.'
                  : 'El enlace de recuperación es inválido.'}
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      description="Ingresa tu nueva contraseña para recuperar el acceso"
      footerLink={{
        text: '← Volver al inicio de sesión',
        href: '/login',
      }}
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  )
}
