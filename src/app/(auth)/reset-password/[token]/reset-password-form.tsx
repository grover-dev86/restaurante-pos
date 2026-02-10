'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { resetPassword, type ResetPasswordState } from '@/lib/actions/password-reset'
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'

interface ResetPasswordFormProps {
  token: string
}

const initialState: ResetPasswordState = {}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Si la contraseña fue actualizada exitosamente
  if (state.success) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{state.message}</AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir a iniciar sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Tu nueva contraseña"
            autoComplete="new-password"
            disabled={isPending}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.errors?.password && (
          <p className="text-sm text-destructive">{state.errors.password}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Mínimo 6 caracteres, una mayúscula, una minúscula y un número
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirma tu nueva contraseña"
            autoComplete="new-password"
            disabled={isPending}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.errors?.confirmPassword && (
          <p className="text-sm text-destructive">{state.errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Actualizando...
          </>
        ) : (
          'Actualizar contraseña'
        )}
      </Button>
    </form>
  )
}
