import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from './reset-password-form'
import { prisma } from '@/lib/prisma'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params

  // Verificar si el token es válido
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  const isValidToken =
    resetToken && !resetToken.used && resetToken.expiresAt > new Date()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Restablecer contraseña
          </CardTitle>
          <CardDescription className="text-center">
            {isValidToken
              ? 'Ingresa tu nueva contraseña'
              : 'El enlace de recuperación no es válido'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidToken ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {resetToken?.used
                    ? 'Este enlace ya fue utilizado.'
                    : resetToken
                      ? 'Este enlace ha expirado.'
                      : 'El enlace de recuperación es inválido.'}
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline text-sm"
                >
                  Solicitar un nuevo enlace de recuperación
                </Link>
              </div>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
