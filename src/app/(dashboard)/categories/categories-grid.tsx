'use client'

import Image from 'next/image'
import { useMemo, useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Can } from '@/components/can'
import { RESOURCES, ACTIONS } from '@/lib/rbac'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { toggleCategoryActive } from '@/actions/categories'
import {
  Plus,
  FolderTree,
  Package,
  Pencil,
  MoreVertical,
  Power,
  Trash2,
  Loader2,
} from 'lucide-react'
import { CategoryFormModal } from './category-form-modal'
import { DeleteCategoryDialog } from './delete-category-dialog'

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  order: number
  isActive: boolean
  parentId: string | null
  parent: { id: string; name: string } | null
  _count: { products: number; children: number }
  createdAt: Date
  updatedAt: Date
}

interface CategoriesGridProps {
  categories: CategoryWithCount[]
  userRole: string
}

type EditingCategory = {
  id: string
  name: string
  description: string | null
  image: string | null
  parentId: string | null
  order: number
  isActive: boolean
} | null

type DeletingCategory = {
  id: string
  name: string
  productsCount: number
  childrenCount: number
} | null

export function CategoriesGrid({ categories, userRole: _userRole }: CategoriesGridProps) {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<EditingCategory>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<DeletingCategory>(null)

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const parentOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  )

  const openCreate = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const openEdit = (category: CategoryWithCount) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      order: category.order,
      isActive: category.isActive,
    })
    setModalOpen(true)
  }

  const openDelete = (category: CategoryWithCount) => {
    setDeletingCategory({
      id: category.id,
      name: category.name,
      productsCount: category._count.products,
      childrenCount: category._count.children,
    })
    setDeleteOpen(true)
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Barra de búsqueda + botón crear */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Buscar por nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full sm:max-w-sm rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Can resource={RESOURCES.CATEGORIES} action={ACTIONS.CREATE}>
              <Button type="button" onClick={openCreate} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nueva categoría
              </Button>
            </Can>
          </div>

          {/* Estado vacío */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <FolderTree className="mx-auto mb-3 h-10 w-10 opacity-40" />
              {categories.length === 0 ? (
                <>
                  <p className="font-medium">Aún no hay categorías</p>
                  <p className="text-sm">Crea la primera para empezar a organizar tu menú</p>
                </>
              ) : (
                <p className="font-medium">No se encontraron resultados para “{search}”</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => openEdit(category)}
                  onDelete={() => openDelete(category)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={editingCategory}
        parentOptions={parentOptions}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deletingCategory}
      />
    </>
  )
}

function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryWithCount
  onEdit: () => void
  onDelete: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleToggleActive = () => {
    startTransition(async () => {
      const result = await toggleCategoryActive(category.id)
      if (result.success) {
        toast({ title: 'Éxito', description: result.message })
        router.refresh()
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' })
      }
    })
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md ${
        !category.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Imagen */}
      <div className="relative aspect-video w-full bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderTree className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Badge de estado en esquina */}
        <div className="absolute right-2 top-2">
          {category.isActive ? (
            <Badge className="bg-green-500/90 text-white hover:bg-green-500">Activa</Badge>
          ) : (
            <Badge variant="secondary">Inactiva</Badge>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{category.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                title="Acciones"
                className="-mr-2 -mt-1 h-8 w-8"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <Can resource={RESOURCES.CATEGORIES} action={ACTIONS.UPDATE}>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleActive}>
                  <Power className="mr-2 h-4 w-4" />
                  {category.isActive ? 'Desactivar' : 'Activar'}
                </DropdownMenuItem>
              </Can>

              <Can resource={RESOURCES.CATEGORIES} action={ACTIONS.DELETE}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {category.parent && (
          <p className="text-xs text-muted-foreground">
            En <span className="font-medium">{category.parent.name}</span>
          </p>
        )}

        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
        )}

        <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5" />
          <span>
            {category._count.products}{' '}
            {category._count.products === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>
    </div>
  )
}
