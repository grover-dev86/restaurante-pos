import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/lib/rbac'
import { getAllCategories } from '@/actions/categories'
import { CategoriesGrid } from './categories-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderTree, FolderCheck, FolderX, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestión de Categorías | Restaurante POS',
  description: 'Administración de categorías de productos',
}

export default async function CategoriesPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')

  const canView = checkPermission(session.user.role || '', 'categories', 'read')
  if (!canView) redirect('/dashboard')

  const categories = await getAllCategories()

  const totalActive = categories.filter((c) => c.isActive).length
  const totalInactive = categories.filter((c) => !c.isActive).length
  const totalProducts = categories.reduce((sum, c) => sum + c._count.products, 0)

  return (
    <div className="min-w-0">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Gestión de Categorías
        </h1>
        <p className="text-muted-foreground mt-1">
          Organiza los productos del menú en categorías
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <FolderCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalActive}</div>
            <p className="text-xs text-muted-foreground">Visibles en el menú</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <FolderX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalInactive}</div>
            <p className="text-xs text-muted-foreground">Ocultas temporalmente</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">En todas las categorías</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de categorías */}
      <CategoriesGrid
        categories={categories}
        userRole={session.user.role || ''}
      />
    </div>
  )
}
