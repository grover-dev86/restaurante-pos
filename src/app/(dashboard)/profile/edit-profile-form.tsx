'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateMyProfile, type ProfileActionState } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { AvatarUpload } from '@/app/(dashboard)/users/avatar-upload'

interface EditProfileFormProps {
  profile: {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
  }
}

const initialState: ProfileActionState = {
  success: false,
  message: '',
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const hasHandledResult = useRef(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar)

  const [state, dispatch, isPending] = useActionState(updateMyProfile, initialState)

  useEffect(() => {
    if (!state.message || hasHandledResult.current) return

    if (state.success) {
      hasHandledResult.current = true
      toast({ title: 'Perfil actualizado', description: state.message })
      router.refresh()
      // Reset el flag para permitir más envíos posteriores
      setTimeout(() => {
        hasHandledResult.current = false
      }, 100)
    } else {
      hasHandledResult.current = true
      toast({ title: 'Error', description: state.message, variant: 'destructive' })
      setTimeout(() => {
        hasHandledResult.current = false
      }, 100)
    }
  }, [state.success, state.message, toast, router])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Editar perfil</CardTitle>
        <CardDescription>
          Actualiza tu información personal. El email se usa para iniciar sesión.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <AvatarUpload
              currentAvatar={profile.avatar}
              onAvatarChange={(url) => setAvatarUrl(url)}
            />
          </div>
          <input type="hidden" name="avatar" value={avatarUrl ?? ''} />

          {/* Nombre y email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Juan Pérez"
                defaultValue={profile.name}
                maxLength={100}
              />
              {state.errors?.name && (
                <p className="text-sm text-destructive">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@ejemplo.com"
                defaultValue={profile.email}
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+51 999 999 999"
              defaultValue={profile.phone ?? ''}
            />
            <p className="text-xs text-muted-foreground">
              Opcional. Solo visible para administradores.
            </p>
            {state.errors?.phone && (
              <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
