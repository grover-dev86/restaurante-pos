import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/lib/rbac'
import { getAllUsers, getRolesForSelect } from '@/actions/users'
import { UsersTable } from './users-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestión de Usuarios | Restaurante POS',
  description: 'Administración de usuarios del sistema',
}

export default async function UsersPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')

  const canViewUsers = checkPermission(session.user.role || '', 'users', 'read')
  if (!canViewUsers) redirect('/dashboard')

  const [users, roles] = await Promise.all([
    getAllUsers(),
    getRolesForSelect(),
  ])

  const totalActive = users.filter((u) => u.isActive).length
  const totalInactive = users.filter((u) => !u.isActive).length

  return (
    <div className="min-w-0">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra los usuarios del sistema y sus permisos de acceso
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalActive}</div>
            <p className="text-xs text-muted-foreground">Usuarios habilitados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalInactive}</div>
            <p className="text-xs text-muted-foreground">Usuarios deshabilitados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Roles disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>Lista de todos los usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <UsersTable
            users={users}
            roles={roles}
            userRole={session.user.role || ''}
            currentUserId={session.user.id || ''}
          />
        </CardContent>
      </Card>
    </div>
  )
}
