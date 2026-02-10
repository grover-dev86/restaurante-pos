'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { requestPasswordReset, type ForgotPasswordState } from '@/lib/actions/password-reset'
import { Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react'

const initialState: ForgotPasswordState = {}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState)

  // Si el email fue enviado exitosamente, mostrar mensaje de éxito
  if (state.success) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {state.message}
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          Revisa tu bandeja de entrada y sigue las instrucciones del email.
          Si no lo encuentras, revisa la carpeta de spam.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={isPending}
            className="pl-10"
          />
        </div>
        {state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar enlace de recuperación'
        )}
      </Button>
    </form>
  )
}
