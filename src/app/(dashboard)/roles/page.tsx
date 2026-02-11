import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/lib/rbac'
import { RolesPageClient } from './roles-page-client'

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

  return <RolesPageClient userRole={session.user.role || ''} />
}
