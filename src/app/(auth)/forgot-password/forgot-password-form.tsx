'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { requestPasswordReset, type ForgotPasswordState } from '@/lib/actions/password-reset'
import { Loader2, AlertCircle, CheckCircle2, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const initialState: ForgotPasswordState = {}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState)

  // Si el email fue enviado exitosamente, mostrar mensaje de éxito
  if (state.success) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">¡Revisa tu correo!</h3>
          <p className="text-sm text-muted-foreground">
            Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu
            contraseña.
          </p>
        </div>
        <Alert className="border-green-200 bg-green-50">
          <Mail className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 ml-2">
            Revisa tu bandeja de entrada y la carpeta de spam.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">← Volver al inicio de sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={isPending}
            className="pl-10 h-11 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-colors"
          />
        </div>
        {state.errors?.email && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {state.errors.email}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar enlace de recuperación
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
