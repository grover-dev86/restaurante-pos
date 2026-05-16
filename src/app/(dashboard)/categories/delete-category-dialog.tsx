'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, AlertTriangle } from 'lucide-react'
import { deleteCategory } from '@/actions/categories'

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: {
    id: string
    name: string
    productsCount: number
    childrenCount: number
  } | null
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!category) return null

  // Bloqueamos en el cliente además del servidor para mejor UX
  const blockingProducts = category.productsCount > 0
  const blockingChildren = category.childrenCount > 0
  const canDelete = !blockingProducts && !blockingChildren

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteCategory(category.id)
      if (result.success) {
        toast({ title: 'Categoría eliminada', description: result.message })
        onOpenChange(false)
        router.refresh()
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al eliminar la categoría',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? '¿Eliminar categoría permanentemente?' : 'No se puede eliminar'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {canDelete ? (
                <>
                  <p>
                    Estás a punto de eliminar permanentemente la categoría{' '}
                    <strong>{category.name}</strong>.
                  </p>
                  <p className="font-medium text-destructive">
                    Esta acción no se puede deshacer. Si solo quieres ocultarla del menú,
                    usa &quot;Desactivar&quot; en su lugar.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    La categoría <strong>{category.name}</strong> no se puede eliminar
                    porque tiene contenido asociado:
                  </p>
                  <ul className="space-y-1.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950">
                    {blockingProducts && (
                      <li className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>
                          <strong>{category.productsCount}</strong>{' '}
                          {category.productsCount === 1 ? 'producto asociado' : 'productos asociados'}
                        </span>
                      </li>
                    )}
                    {blockingChildren && (
                      <li className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>
                          <strong>{category.childrenCount}</strong>{' '}
                          {category.childrenCount === 1 ? 'subcategoría' : 'subcategorías'}
                        </span>
                      </li>
                    )}
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Mueve {blockingProducts ? 'los productos' : ''}
                    {blockingProducts && blockingChildren ? ' y ' : ''}
                    {blockingChildren ? 'las subcategorías' : ''} a otra categoría
                    primero, o desactiva esta categoría si solo quieres ocultarla.
                  </p>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {canDelete ? 'Cancelar' : 'Entendido'}
          </AlertDialogCancel>
          {canDelete && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
