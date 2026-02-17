'use client'

import { useEffect, useActionState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createRole, updateRole, type RoleActionState } from '@/actions/roles'
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Permission {
  id: string
  resource: string
  action: string
  description: string
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string | null
  permissions: Permission[]
}

interface RoleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  allPermissions: Permission[]
}

// Nombres amigables de recursos
const resourceNames: Record<string, string> = {
  users: 'Usuarios',
  roles: 'Roles',
  products: 'Productos',
  categories: 'Categorías',
  sales: 'Ventas',
  customers: 'Clientes',
  suppliers: 'Proveedores',
  tables: 'Mesas',
  inventory: 'Inventario',
  expenses: 'Gastos',
  reports: 'Reportes',
  settings: 'Configuración',
  online_orders: 'Pedidos Online',
}

const actionNames: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Editar',
  delete: 'Eliminar',
}

const initialState: RoleActionState = {
  success: false,
  message: '',
}

// Componente interno del formulario para manejar el estado correctamente
function RoleFormContent({
  role,
  allPermissions,
  onSuccess,
  onCancel,
}: {
  role: Role | null
  allPermissions: Permission[]
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!role
  const hasHandledResult = useRef(false)

  // Crear acción con bind para pasar el ID en caso de edición
  const formAction = isEditing ? updateRole.bind(null, role.id) : createRole

  const [state, dispatch, isPending] = useActionState(formAction, initialState)

  // Agrupar permisos por recurso
  const permissionsByResource = allPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>
  )

  // Manejar resultado de la acción
  useEffect(() => {
    // Solo procesar si hay un mensaje y no lo hemos manejado antes
    if (!state.message || hasHandledResult.current) return

    if (state.success) {
      hasHandledResult.current = true
      toast({
        title: 'Éxito',
        description: state.message,
      })
      router.refresh()
      onSuccess()
    } else {
      hasHandledResult.current = true
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      })
    }
  }, [state.success, state.message, toast, router, onSuccess])

  return (
    <form action={dispatch} className="space-y-6">
      {/* Información básica */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre del rol <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="NUEVO_ROL"
            defaultValue={role?.name ?? ''}
            className="font-mono uppercase"
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name[0]}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Solo mayúsculas y guiones bajos (ej: ADMIN_ROLE)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">
            Nombre visible <span className="text-destructive">*</span>
          </Label>
          <Input
            id="displayName"
            name="displayName"
            placeholder="Nuevo Rol"
            defaultValue={role?.displayName ?? ''}
          />
          {state.errors?.displayName && (
            <p className="text-sm text-destructive">{state.errors.displayName[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descripción del rol y sus responsabilidades..."
          defaultValue={role?.description ?? ''}
          rows={2}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Selector de permisos */}
      <div className="space-y-4">
        <div>
          <Label className="text-base">Permisos</Label>
          <p className="text-sm text-muted-foreground">
            Selecciona los permisos que tendrá este rol
          </p>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(permissionsByResource).map(([resource, permissions]) => (
            <div key={resource} className="rounded-lg border p-3 space-y-2">
              <h4 className="font-medium text-sm">{resourceNames[resource] || resource}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {permissions.map((permission) => {
                  const isChecked =
                    role?.permissions.some((p) => p.id === permission.id) ?? false
                  return (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        name="permissionIds"
                        value={permission.id}
                        defaultChecked={isChecked}
                      />
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-normal cursor-pointer whitespace-nowrap"
                      >
                        {actionNames[permission.action] || permission.action}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Guardar cambios' : 'Crear rol'}
        </Button>
      </div>
    </form>
  )
}

export function RoleFormModal({ open, onOpenChange, role, allPermissions }: RoleFormModalProps) {
  const isEditing = !!role

  const handleSuccess = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditing ? 'Editar rol' : 'Crear nuevo rol'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información y permisos del rol.'
              : 'Completa la información para crear un nuevo rol.'}
          </DialogDescription>
        </DialogHeader>

        {/* Key única para forzar remontaje cuando cambia el rol */}
        <div className="flex-1 overflow-y-auto">
          {open && (
            <RoleFormContent
              key={role?.id ?? 'new'}
              role={role}
              allPermissions={allPermissions}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
