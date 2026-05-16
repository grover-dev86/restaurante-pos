import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  // Quien puede crear o editar categorías puede subir imágenes
  const canUpdate = checkPermission(session.user.role || '', 'categories', 'update')
  const canCreate = checkPermission(session.user.role || '', 'categories', 'create')
  if (!canUpdate && !canCreate) {
    return NextResponse.json({ success: false, message: 'Sin permiso' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Formato no válido. Solo JPG, PNG o WebP' },
        { status: 400 }
      )
    }

    // Validar tamaño (máx 5MB para imágenes de categoría)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'La imagen no debe superar los 5MB' },
        { status: 400 }
      )
    }

    // Convertir a base64 para Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Subir a Cloudinary con crop 16:9 para banners de card
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'restaurante-pos/categories',
      transformation: [
        { width: 1200, height: 675, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Error al subir imagen de categoría:', error)
    return NextResponse.json(
      { success: false, message: 'Error al subir la imagen' },
      { status: 500 }
    )
  }
}
