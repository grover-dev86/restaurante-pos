import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/lib/rbac'
import { getRoles, getPermissions } from '@/actions/roles'
import { RolesTable } from './roles-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, Key, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestión de Roles | Restaurante POS',
  description: 'Administración de roles y permisos del sistema',
}

export default async function RolesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Verificar permiso para ver roles
  const canViewRoles = checkPermission(session.user.role || '', 'roles', 'read')

  if (!canViewRoles) {
    redirect('/dashboard')
  }

  // Obtener datos
  const [roles, permissions] = await Promise.all([
    getRoles(),
    getPermissions(),
  ])

  // Estadísticas
  const totalUsers = roles.reduce((acc, role) => acc + role._count.users, 0)
  const totalPermissions = permissions.length

  return (
    <div className="min-w-0">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Gestión de Roles
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra los roles del sistema y sus permisos de acceso
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Roles configurados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Con roles asignados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permisos</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPermissions}</div>
            <p className="text-xs text-muted-foreground">Disponibles en el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(permissions.map((p) => p.resource)).size}
            </div>
            <p className="text-xs text-muted-foreground">Áreas protegidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de roles */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Roles del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los roles y sus permisos asignados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <RolesTable
            roles={roles}
            allPermissions={permissions}
            userRole={session.user.role || ''}
          />
        </CardContent>
      </Card>
    </div>
  )
}
