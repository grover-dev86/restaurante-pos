'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { changeMyPassword, type ProfileActionState } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'

const initialState: ProfileActionState = {
  success: false,
  message: '',
}

export function ChangePasswordForm() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  // Rastrea el último objeto `state` ya procesado por referencia
  // (useActionState retorna una referencia nueva en cada submit).
  // Evita el doble disparo del toast al re-renderizar el componente.
  const lastHandledState = useRef<ProfileActionState | null>(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [state, dispatch, isPending] = useActionState(changeMyPassword, initialState)

  useEffect(() => {
    if (!state.message) return
    if (lastHandledState.current === state) return
    lastHandledState.current = state

    if (state.success) {
      toast({
        title: 'Contraseña actualizada',
        description: state.message,
      })
      // Limpiar el formulario al cambiar exitosamente
      formRef.current?.reset()
      setShowCurrent(false)
      setShowNew(false)
      setShowConfirm(false)
    } else {
      toast({ title: 'Error', description: state.message, variant: 'destructive' })
    }
  }, [state, toast])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Cambiar contraseña
        </CardTitle>
        <CardDescription>
          Por seguridad, debes ingresar tu contraseña actual para confirmar el cambio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-5">
          {/* Contraseña actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Contraseña actual <span className="text-destructive">*</span>
            </Label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder="Tu contraseña actual"
              show={showCurrent}
              onToggleShow={() => setShowCurrent((v) => !v)}
            />
            {state.errors?.currentPassword && (
              <p className="text-sm text-destructive">{state.errors.currentPassword[0]}</p>
            )}
          </div>

          {/* Separador visual */}
          <div className="border-t pt-5 space-y-5">
            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                Nueva contraseña <span className="text-destructive">*</span>
              </Label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                placeholder="Mínimo 6 caracteres"
                show={showNew}
                onToggleShow={() => setShowNew((v) => !v)}
              />
              <p className="text-xs text-muted-foreground">
                Debe contener al menos: 6 caracteres, una mayúscula, una minúscula y un
                número.
              </p>
              {state.errors?.newPassword && (
                <p className="text-sm text-destructive">{state.errors.newPassword[0]}</p>
              )}
            </div>

            {/* Confirmar nueva */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmar nueva contraseña <span className="text-destructive">*</span>
              </Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite la nueva contraseña"
                show={showConfirm}
                onToggleShow={() => setShowConfirm((v) => !v)}
              />
              {state.errors?.confirmPassword && (
                <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Actualizar contraseña
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PasswordInput({
  id,
  name,
  placeholder,
  show,
  onToggleShow,
}: {
  id: string
  name: string
  placeholder: string
  show: boolean
  onToggleShow: () => void
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-10"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
