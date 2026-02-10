import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from './forgot-password-form'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
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
