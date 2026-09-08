import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import { getAllProducts, getAllCategoriesForFilter } from '@/actions/products'
import { ProductsTable } from './products-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Productos | Restaurante POS',
  description: 'Administración del catálogo de productos',
}

export default async function ProductsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const canView = checkPermission(session.user.role || '', 'products', 'read')
  if (!canView) redirect('/dashboard')

  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategoriesForFilter(),
  ])

  return (
    <div className="min-w-0 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Productos
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra el catálogo de productos del restaurante
        </p>
      </div>

      {/* Tabla */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Catálogo</CardTitle>
          <CardDescription>Lista completa de productos registrados</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <ProductsTable products={products} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
