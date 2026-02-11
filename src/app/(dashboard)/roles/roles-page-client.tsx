'use client'

import { useState } from 'react'
import { ROLES, ROLE_PERMISSIONS, RESOURCES, ACTIONS, type RoleName } from '@/lib/rbac'
import { checkPermission } from '@/lib/rbac'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Shield, Eye, Users, ChefHat, UserCog, User, Check, X } from 'lucide-react'

interface RolesPageClientProps {
  userRole: string
}

// Información descriptiva de cada rol
const roleInfo: Record<RoleName, { description: string; icon: React.ElementType; color: string }> = {
  ADMIN: {
    description: 'Acceso completo a todas las funciones del sistema',
    icon: Shield,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  MANAGER: {
    description: 'Gestión de operaciones, empleados y reportes',
    icon: UserCog,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  CASHIER: {
    description: 'Punto de venta, cobros y atención al cliente',
    icon: Users,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  WAITER: {
    description: 'Toma de órdenes y gestión de mesas',
    icon: ChefHat,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  USER: {
    description: 'Acceso básico de solo lectura',
    icon: User,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
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

// Nombres de acciones
const actionNames: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Editar',
  delete: 'Eliminar',
  manage: 'Gestionar',
}

export function RolesPageClient({ userRole }: RolesPageClientProps) {
  const [selectedRole, setSelectedRole] = useState<RoleName | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const canEditRoles = checkPermission(userRole, 'roles', 'update')

  const handleViewPermissions = (role: RoleName) => {
    setSelectedRole(role)
    setDialogOpen(true)
  }

  // Contar permisos por rol
  const countPermissions = (role: RoleName) => {
    const permissions = ROLE_PERMISSIONS[role]
    let count = 0
    Object.values(permissions).forEach((actions) => {
      count += actions.length
    })
    return count
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Gestión de Roles
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualiza y administra los roles del sistema y sus permisos
        </p>
      </div>

      {/* Grid de roles */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => {
          const info = roleInfo[role]
          const Icon = info.icon
          const permissionCount = countPermissions(role)

          return (
            <Card
              key={role}
              className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleViewPermissions(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${info.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {permissionCount} permisos
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">{role}</CardTitle>
                <CardDescription className="text-sm">
                  {info.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewPermissions(role)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver permisos
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Información adicional */}
      <Card className="mt-8 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Acerca de los Roles</CardTitle>
          <CardDescription>
            Los roles definen qué acciones puede realizar cada usuario en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary">{ROLES.length}</div>
              <p className="text-sm text-muted-foreground">Roles definidos</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary">
                {Object.keys(RESOURCES).length}
              </div>
              <p className="text-sm text-muted-foreground">Recursos del sistema</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary">
                {Object.keys(ACTIONS).length}
              </div>
              <p className="text-sm text-muted-foreground">Tipos de acciones</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-primary">
                {countPermissions('ADMIN')}
              </div>
              <p className="text-sm text-muted-foreground">Permisos máximos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de permisos */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedRole && (
                <>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${roleInfo[selectedRole].color}`}>
                    {(() => {
                      const Icon = roleInfo[selectedRole].icon
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                  <div>
                    <span className="text-xl">Permisos del rol: {selectedRole}</span>
                    <p className="text-sm font-normal text-muted-foreground mt-1">
                      {roleInfo[selectedRole].description}
                    </p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Matriz de permisos para el rol seleccionado
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Recurso</TableHead>
                    {Object.values(ACTIONS).map((action) => (
                      <TableHead key={action} className="text-center w-[100px]">
                        {actionNames[action]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(RESOURCES).map((resource) => {
                    const rolePermissions = ROLE_PERMISSIONS[selectedRole]
                    const resourcePerms = rolePermissions[resource as keyof typeof rolePermissions] || []

                    return (
                      <TableRow key={resource}>
                        <TableCell className="font-medium">
                          {resourceNames[resource] || resource}
                        </TableCell>
                        {Object.values(ACTIONS).map((action) => {
                          const hasPermission = (resourcePerms as readonly string[]).includes(action)
                          return (
                            <TableCell key={action} className="text-center">
                              {hasPermission ? (
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
                    )
                  })}
                </TableBody>
              </Table>

              {!canEditRoles && (
                <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Nota:</strong> Solo los administradores pueden modificar los permisos de los roles.
                    Los permisos mostrados son de solo lectura.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
