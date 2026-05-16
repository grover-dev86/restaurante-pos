'use client'

import { useEffect, useActionState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  createCategory,
  updateCategory,
  type CategoryActionState,
} from '@/actions/categories'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ImagePlus } from 'lucide-react'

interface ParentOption {
  id: string
  name: string
}

interface CategoryFormData {
  id: string
  name: string
  description: string | null
  image: string | null
  parentId: string | null
  order: number
  isActive: boolean
}

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryFormData | null
  parentOptions: ParentOption[]
}

const initialState: CategoryActionState = {
  success: false,
  message: '',
}

const NO_PARENT_VALUE = '__none__'

function CategoryFormContent({
  category,
  parentOptions,
  onSuccess,
  onCancel,
}: {
  category: CategoryFormData | null
  parentOptions: ParentOption[]
  onSuccess: () => void
  onCancel: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!category
  const hasHandledResult = useRef(false)

  // En modo edición, una categoría no puede ser su propia padre
  const availableParents = isEditing
    ? parentOptions.filter((p) => p.id !== category.id)
    : parentOptions

  const formAction = isEditing ? updateCategory.bind(null, category.id) : createCategory

  const [state, dispatch, isPending] = useActionState(formAction, initialState)

  useEffect(() => {
    if (!state.message || hasHandledResult.current) return

    if (state.success) {
      hasHandledResult.current = true
      toast({ title: 'Éxito', description: state.message })
      router.refresh()
      onSuccess()
    } else {
      hasHandledResult.current = true
      toast({ title: 'Error', description: state.message, variant: 'destructive' })
    }
  }, [state.success, state.message, toast, router, onSuccess])

  return (
    <form action={dispatch} className="space-y-5">
      {/* Imagen (se conectará con Cloudinary en la próxima subtarea) */}
      <div className="space-y-2">
        <Label>Imagen</Label>
        <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/40">
          <div className="text-center text-muted-foreground">
            <ImagePlus className="mx-auto mb-1 h-6 w-6" />
            <p className="text-xs">Upload de imagen — próximamente</p>
          </div>
        </div>
        <input type="hidden" name="image" value={category?.image ?? ''} />
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej. Pizzas, Bebidas, Postres…"
          defaultValue={category?.name ?? ''}
          maxLength={80}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          El slug se generará automáticamente desde el nombre.
        </p>
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Breve descripción opcional"
          defaultValue={category?.description ?? ''}
          rows={3}
          maxLength={500}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Categoría padre */}
        <div className="space-y-2">
          <Label htmlFor="parentId">Categoría padre</Label>
          <Select
            name="parentId"
            defaultValue={category?.parentId ?? NO_PARENT_VALUE}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ninguna (categoría raíz)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PARENT_VALUE}>Ninguna (categoría raíz)</SelectItem>
              {availableParents.map((parent) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.parentId && (
            <p className="text-sm text-destructive">{state.errors.parentId[0]}</p>
          )}
        </div>

        {/* Orden */}
        <div className="space-y-2">
          <Label htmlFor="order">Orden</Label>
          <Input
            id="order"
            name="order"
            type="number"
            min={0}
            placeholder="0"
            defaultValue={category?.order ?? 0}
          />
          <p className="text-xs text-muted-foreground">Menor número aparece primero.</p>
        </div>
      </div>

      {/* Activa / Inactiva */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          name="isActive"
          defaultChecked={category?.isActive ?? true}
          value="true"
        />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Categoría activa (visible en el menú)
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  )
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  parentOptions,
}: CategoryFormModalProps) {
  const isEditing = !!category

  const handleSuccess = useCallback(() => onOpenChange(false), [onOpenChange])
  const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? 'Editar categoría' : 'Crear nueva categoría'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica la información de la categoría.'
              : 'Completa la información para crear una nueva categoría del menú.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {open && (
            <CategoryFormContent
              key={category?.id ?? 'new'}
              category={category}
              parentOptions={parentOptions}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
