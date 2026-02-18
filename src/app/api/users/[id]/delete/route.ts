import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission } from '@/lib/rbac'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Paralelizar auth y params
  const [session, { id }] = await Promise.all([auth(), params])

  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 })
  }

  if (!checkPermission(session.user.role || '', 'users', 'delete')) {
    return NextResponse.json({ success: false, message: 'Sin permiso' }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { sales: true, activities: true, receivings: true, adjustments: true, expenses: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 })
    }

    if (user.id === session.user.id) {
      return NextResponse.json({ success: false, message: 'No puedes eliminar tu propia cuenta' }, { status: 400 })
    }

    const totalRelations =
      user._count.sales + user._count.activities + user._count.receivings +
      user._count.adjustments + user._count.expenses

    if (totalRelations > 0) {
      return NextResponse.json({
        success: false,
        message: `No se puede eliminar porque tiene ${totalRelations} registro(s) asociados. Desactívalo en su lugar.`,
      }, { status: 400 })
    }

    // Ambas operaciones en una sola transacción (1 round-trip a la BD)
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])

    return NextResponse.json({ success: true, message: 'Usuario eliminado permanentemente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json({ success: false, message: 'Error al eliminar el usuario' }, { status: 500 })
  }
}
