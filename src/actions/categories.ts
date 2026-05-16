'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

// ==========================================
// Schemas Zod
// ==========================================

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede tener más de 80 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional()
    .or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

const updateCategorySchema = createCategorySchema

/**
 * Sentinel usado por el <Select> del modal cuando se elige "Ninguna categoría padre".
 * Necesario porque shadcn <Select> no admite value="".
 */
const NO_PARENT_VALUE = '__none__'

/**
 * Normaliza el FormData del modal a los tipos que esperan los schemas Zod.
 * - parentId === '__none__'      → undefined (categoría raíz)
 * - isActive ausente en FormData → false (checkbox desmarcado)
 * - isActive presente            → true
 */
function normalizeFormData(formData: FormData) {
  const parentIdRaw = (formData.get('parentId') as string) || ''
  return {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || undefined,
    image: (formData.get('image') as string) || undefined,
    parentId:
      parentIdRaw && parentIdRaw !== NO_PARENT_VALUE ? parentIdRaw : undefined,
    order: formData.get('order') || undefined,
    isActive: formData.has('isActive'),
  }
}

export type CategoryActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// ==========================================
// Helpers internos
// ==========================================

/**
 * Genera un slug único para la categoría.
 * Si el slug base ya existe, agrega un sufijo numérico: pizzas, pizzas-2, pizzas-3...
 */
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let counter = 2

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing || existing.id === excludeId) return slug

    slug = `${base}-${counter}`
    counter += 1
  }
}

// ==========================================
// Lecturas
// ==========================================

export async function getAllCategories() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'categories', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver categorías')

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true, children: true },
      },
      parent: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })

  return categories
}

export async function getCategoryById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'categories', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver categorías')

  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, children: true } },
    },
  })
}

/**
 * Devuelve categorías para usar en un <Select> de "Categoría padre".
 * Excluye opcionalmente el id de la categoría que se está editando
 * (no puede ser su propio padre).
 */
export async function getCategoriesForSelect(excludeId?: string) {
  const categories = await prisma.category.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { id: true, name: true, parentId: true },
    orderBy: { name: 'asc' },
  })
  return categories
}

// ==========================================
// Mutaciones
// ==========================================

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canCreate = checkPermission(session.user.role || '', 'categories', 'create')
  if (!canCreate)
    return { success: false, message: 'No tienes permiso para crear categorías' }

  const rawData = normalizeFormData(formData)
  const validated = createCategorySchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name: validated.data.name },
    })
    if (existing) {
      return {
        success: false,
        message: 'Ya existe una categoría con ese nombre',
        errors: { name: ['Este nombre ya está en uso'] },
      }
    }

    const slug = await generateUniqueSlug(validated.data.name)

    await prisma.category.create({
      data: {
        name: validated.data.name,
        slug,
        description: validated.data.description || null,
        image: validated.data.image || null,
        parentId: validated.data.parentId || null,
        order: validated.data.order ?? 0,
        isActive: validated.data.isActive ?? true,
      },
    })

    revalidatePath('/categories')
    return { success: true, message: 'Categoría creada exitosamente' }
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return { success: false, message: 'Error al crear la categoría' }
  }
}

export async function updateCategory(
  id: string,
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'categories', 'update')
  if (!canUpdate)
    return { success: false, message: 'No tienes permiso para editar categorías' }

  const rawData = normalizeFormData(formData)
  const validated = updateCategorySchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const existingCategory = await prisma.category.findUnique({ where: { id } })
    if (!existingCategory) return { success: false, message: 'Categoría no encontrada' }

    // Una categoría no puede ser su propio padre
    if (validated.data.parentId === id) {
      return {
        success: false,
        message: 'Una categoría no puede ser su propia categoría padre',
        errors: { parentId: ['Selección inválida'] },
      }
    }

    // Si cambió el nombre, validar unicidad
    if (validated.data.name !== existingCategory.name) {
      const nameInUse = await prisma.category.findUnique({
        where: { name: validated.data.name },
      })
      if (nameInUse) {
        return {
          success: false,
          message: 'Ya existe una categoría con ese nombre',
          errors: { name: ['Este nombre ya está en uso'] },
        }
      }
    }

    // Si cambió el nombre, regenerar slug
    const slug =
      validated.data.name !== existingCategory.name
        ? await generateUniqueSlug(validated.data.name, id)
        : existingCategory.slug

    await prisma.category.update({
      where: { id },
      data: {
        name: validated.data.name,
        slug,
        description: validated.data.description || null,
        image: validated.data.image || null,
        parentId: validated.data.parentId || null,
        order: validated.data.order ?? existingCategory.order,
        isActive: validated.data.isActive ?? existingCategory.isActive,
      },
    })

    revalidatePath('/categories')
    return { success: true, message: 'Categoría actualizada exitosamente' }
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return { success: false, message: 'Error al actualizar la categoría' }
  }
}

/**
 * Reordena categorías en lote: recibe un array de ids en el orden deseado
 * y actualiza el campo `order` de cada una con su posición.
 * Usado por el drag and drop.
 */
export async function reorderCategories(orderedIds: string[]): Promise<CategoryActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'categories', 'update')
  if (!canUpdate)
    return { success: false, message: 'No tienes permiso para reordenar categorías' }

  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { order: index },
        })
      )
    )

    revalidatePath('/categories')
    return { success: true, message: 'Orden actualizado' }
  } catch (error) {
    console.error('Error al reordenar categorías:', error)
    return { success: false, message: 'Error al guardar el orden' }
  }
}

export async function toggleCategoryActive(id: string): Promise<CategoryActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'categories', 'update')
  if (!canUpdate)
    return { success: false, message: 'No tienes permiso para modificar categorías' }

  try {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) return { success: false, message: 'Categoría no encontrada' }

    await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    })

    revalidatePath('/categories')
    return {
      success: true,
      message: category.isActive ? 'Categoría desactivada' : 'Categoría activada',
    }
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error)
    return { success: false, message: 'Error al cambiar el estado de la categoría' }
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canDelete = checkPermission(session.user.role || '', 'categories', 'delete')
  if (!canDelete)
    return { success: false, message: 'No tienes permiso para eliminar categorías' }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
      },
    })
    if (!category) return { success: false, message: 'Categoría no encontrada' }

    // No permitir eliminar si tiene productos
    if (category._count.products > 0) {
      return {
        success: false,
        message: `No se puede eliminar: tiene ${category._count.products} producto(s) asociado(s). Muévelos a otra categoría primero.`,
      }
    }

    // No permitir eliminar si tiene subcategorías
    if (category._count.children > 0) {
      return {
        success: false,
        message: `No se puede eliminar: tiene ${category._count.children} subcategoría(s). Elimínalas o muévelas primero.`,
      }
    }

    await prisma.category.delete({ where: { id } })

    revalidatePath('/categories')
    return { success: true, message: 'Categoría eliminada permanentemente' }
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return { success: false, message: 'Error al eliminar la categoría' }
  }
}
