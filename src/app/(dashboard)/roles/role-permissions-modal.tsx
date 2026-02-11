'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check, X, Shield } from 'lucide-react'

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

interface RolePermissionsModalProps {
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

const ACTIONS = ['create', 'read', 'update', 'delete']

export function RolePermissionsModal({
  open,
  onOpenChange,
  role,
  allPermissions,
}: RolePermissionsModalProps) {
  if (!role) return null

  // Obtener recursos únicos
  const resources = [...new Set(allPermissions.map((p) => p.resource))]

  // Verificar si el rol tiene un permiso específico
  const hasPermission = (resource: string, action: string) => {
    return role.permissions.some(
      (p) => p.resource === resource && p.action === action
    )
  }

  // Contar permisos
  const totalPermissions = allPermissions.length
  const rolePermissionCount = role.permissions.length
  const percentage = Math.round((rolePermissionCount / totalPermissions) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl">{role.displayName}</span>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {role.description || 'Sin descripción'}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Matriz de permisos para el rol {role.displayName}
          </DialogDescription>
        </DialogHeader>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-2xl font-bold text-primary">{rolePermissionCount}</div>
            <p className="text-xs text-muted-foreground">Permisos asignados</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-2xl font-bold">{totalPermissions}</div>
            <p className="text-xs text-muted-foreground">Total disponibles</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-2xl font-bold">{percentage}%</div>
            <p className="text-xs text-muted-foreground">Cobertura</p>
          </div>
        </div>

        {/* Tabla de permisos */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Recurso</TableHead>
                {ACTIONS.map((action) => (
                  <TableHead key={action} className="text-center w-[100px]">
                    {actionNames[action]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource}>
                  <TableCell className="font-medium">
                    {resourceNames[resource] || resource}
                  </TableCell>
                  {ACTIONS.map((action) => {
                    const has = hasPermission(resource, action)
                    return (
                      <TableCell key={action} className="text-center">
                        {has ? (
                          <div className="flex justify-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                              <X className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-6 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <span>Permitido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <X className="h-3 w-3 text-gray-400" />
            </div>
            <span>No permitido</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
