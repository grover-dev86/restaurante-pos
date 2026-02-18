'use client'

import { useEffect, useActionState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, updateUser, type UserActionState } from '@/actions/users'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Role {
  id: string
  name: string
  displayName: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  roleId: string
}

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  roles: Role[]
}

const initialState: UserActionState = {
  success: false,
  message: '',
}

function UserFormContent({
  user,
  roles,
  onSuccess,
  onCancel,
}: {
  user: User | null
  roles: Role[]
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!user
  const hasHandledResult = useRef(false)

  const formAction = isEditing ? updateUser.bind(null, user.id) : createUser

  const [state, dispatch, isPending] = useActionState(formAction, initialState)

  useEffect(() => {
    if (!state.message || hasHandledResult.current) return

    if (state.success) {
      hasHandledResult.current = true
      toast({ title: 'Éxito', description: state.message })
      router.refresh()
      onSuccess()
    } else {
      hasHandledResult.current = true
      toast({ title: 'Error', description: state.message, variant: 'destructive' })
    }
  }, [state.success, state.message, toast, router, onSuccess])

  return (
    <form action={dispatch} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            defaultValue={user?.name ?? ''}
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
            defaultValue={user?.email ?? ''}
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">
            Contraseña {!isEditing && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={isEditing ? 'Dejar vacío para no cambiar' : '••••••'}
          />
          {state.errors?.password && (
            <p className="text-sm text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+51 999 999 999"
            defaultValue={user?.phone ?? ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleId">
          Rol <span className="text-destructive">*</span>
        </Label>
        <Select name="roleId" defaultValue={user?.roleId ?? ''}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.roleId && (
          <p className="text-sm text-destructive">{state.errors.roleId[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  )
}

export function UserFormModal({ open, onOpenChange, user, roles }: UserFormModalProps) {
  const isEditing = !!user

  const handleSuccess = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información del usuario.'
              : 'Completa la información para crear un nuevo usuario.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {open && (
            <UserFormContent
              key={user?.id ?? 'new'}
              user={user}
              roles={roles}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
