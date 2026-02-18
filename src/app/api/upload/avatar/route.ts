import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkPermission } from '@/lib/rbac'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  if (!checkPermission(session.user.role || '', 'users', 'update')) {
    return NextResponse.json({ success: false, message: 'Sin permiso' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'Formato no válido. Solo JPG, PNG o WebP',
      }, { status: 400 })
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'La imagen no debe superar los 2MB',
      }, { status: 400 })
    }

    // Convertir a buffer y luego a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'restaurante-pos/avatars',
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Error al subir avatar:', error)
    return NextResponse.json({ success: false, message: 'Error al subir la imagen' }, { status: 500 })
  }
}
