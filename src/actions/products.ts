'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

// ==========================================
// Schemas Zod (solo campos core de producto)
// ==========================================

const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede tener más de 150 caracteres'),
  description: z
    .string()
    .max(1000, 'La descripción no puede tener más de 1000 caracteres')
    .optional()
    .or(z.literal('')),
  barcode: z
    .string()
    .max(50, 'El código de barras no puede tener más de 50 caracteres')
    .optional()
    .or(z.literal('')),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo').optional(),
  minStock: z.coerce.number().int().min(0, 'El stock mínimo no puede ser negativo').optional(),
  isActive: z.boolean().optional(),
})

const updateProductSchema = createProductSchema

export type ProductActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// ==========================================
// Helpers internos
// ==========================================

/**
 * Genera un slug único para el producto, con sufijo numérico si el
 * base ya está en uso: hamburguesa, hamburguesa-2, hamburguesa-3…
 * Mismo patrón que categorías (HU-008).
 */
async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let counter = 2

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (!existing || existing.id === excludeId) return slug
    slug = `${base}-${counter}`
    counter += 1
  }
}

function normalizeFormData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || undefined,
    barcode: (formData.get('barcode') as string) || undefined,
    categoryId: formData.get('categoryId') as string,
    stock: formData.get('stock') || undefined,
    minStock: formData.get('minStock') || undefined,
    // Los checkboxes solo aparecen en FormData cuando están marcados
    isActive: formData.has('isActive'),
  }
}

// ==========================================
// Lecturas
// ==========================================

/**
 * Devuelve todos los productos NO borrados (soft delete respetado).
 * Incluye categoría y contador de saleItems/orderItems para que el UI
 * pueda mostrar si el producto tiene ventas asociadas (bloqueo de delete).
 */
export async function getAllProducts() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'products', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver productos')

  return prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { saleItems: true, orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const canRead = checkPermission(session.user.role || '', 'products', 'read')
  if (!canRead) throw new Error('No tienes permiso para ver productos')

  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      prices: { orderBy: [{ isDefault: 'desc' }, { price: 'asc' }] },
      images: { orderBy: { order: 'asc' } },
    },
  })
}

/**
 * Categorías activas para el <Select> del formulario de producto.
 * (Un producto no debería asignarse a una categoría inactiva.)
 */
export async function getCategoriesForProductSelect() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

/**
 * Todas las categorías (incluidas inactivas) para el <Select> de filtro
 * de la tabla de productos. Un producto puede pertenecer a una categoría
 * inactiva y el admin quiere poder filtrarlo igualmente.
 */
export async function getAllCategoriesForFilter() {
  return prisma.category.findMany({
    select: { id: true, name: true, isActive: true },
    orderBy: { name: 'asc' },
  })
}

// ==========================================
// Mutaciones
// ==========================================

export async function createProduct(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canCreate = checkPermission(session.user.role || '', 'products', 'create')
  if (!canCreate) return { success: false, message: 'No tienes permiso para crear productos' }

  const validated = createProductSchema.safeParse(normalizeFormData(formData))
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    // Unicidad de nombre
    const nameInUse = await prisma.product.findUnique({
      where: { name: validated.data.name },
    })
    if (nameInUse) {
      return {
        success: false,
        message: 'Ya existe un producto con ese nombre',
        errors: { name: ['Este nombre ya está en uso'] },
      }
    }

    // Unicidad de barcode (solo si se proporcionó)
    if (validated.data.barcode) {
      const bcInUse = await prisma.product.findUnique({
        where: { barcode: validated.data.barcode },
      })
      if (bcInUse) {
        return {
          success: false,
          message: 'El código de barras ya está en uso',
          errors: { barcode: ['Este código ya está registrado'] },
        }
      }
    }

    // La categoría debe existir y estar activa
    const category = await prisma.category.findUnique({
      where: { id: validated.data.categoryId },
      select: { id: true, isActive: true },
    })
    if (!category) {
      return {
        success: false,
        message: 'La categoría seleccionada no existe',
        errors: { categoryId: ['Categoría inválida'] },
      }
    }
    if (!category.isActive) {
      return {
        success: false,
        message: 'No puedes asignar el producto a una categoría inactiva',
        errors: { categoryId: ['Categoría inactiva'] },
      }
    }

    const slug = await generateUniqueSlug(validated.data.name)

    await prisma.product.create({
      data: {
        name: validated.data.name,
        slug,
        description: validated.data.description || null,
        barcode: validated.data.barcode || null,
        categoryId: validated.data.categoryId,
        stock: validated.data.stock ?? 0,
        minStock: validated.data.minStock ?? 5,
        isActive: validated.data.isActive ?? true,
      },
    })

    revalidatePath('/products')
    return { success: true, message: 'Producto creado exitosamente' }
  } catch (error) {
    console.error('Error al crear producto:', error)
    return { success: false, message: 'Error al crear el producto' }
  }
}

export async function updateProduct(
  id: string,
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canUpdate = checkPermission(session.user.role || '', 'products', 'update')
  if (!canUpdate) return { success: false, message: 'No tienes permiso para editar productos' }

  const validated = updateProductSchema.safeParse(normalizeFormData(formData))
  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      return { success: false, message: 'Producto no encontrado' }
    }

    // Si cambió el nombre, validar unicidad
    if (validated.data.name !== existing.name) {
      const nameInUse = await prisma.product.findUnique({
        where: { name: validated.data.name },
      })
      if (nameInUse) {
        return {
          success: false,
          message: 'Ya existe un producto con ese nombre',
          errors: { name: ['Este nombre ya está en uso'] },
        }
      }
    }

    // Si cambió el barcode, validar unicidad
    if (validated.data.barcode && validated.data.barcode !== existing.barcode) {
      const bcInUse = await prisma.product.findUnique({
        where: { barcode: validated.data.barcode },
      })
      if (bcInUse) {
        return {
          success: false,
          message: 'El código de barras ya está en uso',
          errors: { barcode: ['Este código ya está registrado'] },
        }
      }
    }

    // Categoría válida
    const category = await prisma.category.findUnique({
      where: { id: validated.data.categoryId },
      select: { id: true, isActive: true },
    })
    if (!category) {
      return {
        success: false,
        message: 'La categoría seleccionada no existe',
        errors: { categoryId: ['Categoría inválida'] },
      }
    }

    // Si cambió el nombre, regenerar slug para mantenerlo coherente
    const slug =
      validated.data.name !== existing.name
        ? await generateUniqueSlug(validated.data.name, id)
        : existing.slug

    await prisma.product.update({
      where: { id },
      data: {
        name: validated.data.name,
        slug,
        description: validated.data.description || null,
        barcode: validated.data.barcode || null,
        categoryId: validated.data.categoryId,
        stock: validated.data.stock ?? existing.stock,
        minStock: validated.data.minStock ?? existing.minStock,
        isActive: validated.data.isActive ?? existing.isActive,
      },
    })

    revalidatePath('/products')
    return { success: true, message: 'Producto actualizado exitosamente' }
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return { success: false, message: 'Error al actualizar el producto' }
  }
}

/**
 * Soft delete: marca deletedAt en lugar de borrar el registro.
 * Preserva la integridad histórica de ventas asociadas.
 * (Un delete "duro" con validación de ventas viene en la subtarea 12.)
 */
export async function deleteProduct(id: string): Promise<ProductActionState> {
  const session = await auth()
  if (!session?.user) return { success: false, message: 'No autorizado' }

  const canDelete = checkPermission(session.user.role || '', 'products', 'delete')
  if (!canDelete) return { success: false, message: 'No tienes permiso para eliminar productos' }

  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product || product.deletedAt) {
      return { success: false, message: 'Producto no encontrado' }
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    })

    revalidatePath('/products')
    return { success: true, message: 'Producto eliminado' }
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return { success: false, message: 'Error al eliminar el producto' }
  }
}
