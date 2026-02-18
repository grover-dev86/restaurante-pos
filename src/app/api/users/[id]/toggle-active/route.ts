import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission } from '@/lib/rbac'

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  const canUpdate = checkPermission(session.user.role || '', 'users', 'update')
  if (!canUpdate) {
    return NextResponse.json({ success: false, message: 'Sin permiso' }, { status: 403 })
  }

  const { id } = await params

  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 })
    }

    if (user.id === session.user.id) {
      return NextResponse.json({ success: false, message: 'No puedes desactivar tu propia cuenta' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    })

    return NextResponse.json({
      success: true,
      message: user.isActive ? 'Usuario desactivado' : 'Usuario activado',
    })
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 })
  }
}
