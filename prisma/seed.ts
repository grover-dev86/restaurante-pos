import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // 1. Crear roles
  console.log('📝 Creando roles...')

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      displayName: 'Administrador',
      description: 'Acceso completo al sistema',
    },
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      displayName: 'Gerente',
      description: 'Gestión de operaciones del restaurante',
    },
  })

  const cashierRole = await prisma.role.upsert({
    where: { name: 'CASHIER' },
    update: {},
    create: {
      name: 'CASHIER',
      displayName: 'Cajero',
      description: 'Operaciones de punto de venta',
    },
  })

  const waiterRole = await prisma.role.upsert({
    where: { name: 'WAITER' },
    update: {},
    create: {
      name: 'WAITER',
      displayName: 'Mesero',
      description: 'Toma de pedidos y gestión de mesas',
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      displayName: 'Usuario',
      description: 'Usuario básico con acceso limitado',
    },
  })

  console.log('✅ Roles creados:', { adminRole, managerRole, cashierRole, waiterRole, userRole })

  // 2. Crear usuarios de prueba
  console.log('👤 Creando usuarios de prueba...')

  const hashedPassword = await bcrypt.hash('123456', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@restaurante.com' },
    update: {},
    create: {
      email: 'admin@restaurante.com',
      name: 'Administrador',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: 'gerente@restaurante.com' },
    update: {},
    create: {
      email: 'gerente@restaurante.com',
      name: 'María García',
      password: hashedPassword,
      roleId: managerRole.id,
      isActive: true,
    },
  })

  const cashierUser = await prisma.user.upsert({
    where: { email: 'cajero@restaurante.com' },
    update: {},
    create: {
      email: 'cajero@restaurante.com',
      name: 'Juan Pérez',
      password: hashedPassword,
      roleId: cashierRole.id,
      isActive: true,
    },
  })

  const waiterUser = await prisma.user.upsert({
    where: { email: 'mesero@restaurante.com' },
    update: {},
    create: {
      email: 'mesero@restaurante.com',
      name: 'Carlos López',
      password: hashedPassword,
      roleId: waiterRole.id,
      isActive: true,
    },
  })

  console.log('✅ Usuarios creados:')
  console.log('   - admin@restaurante.com (contraseña: 123456)')
  console.log('   - gerente@restaurante.com (contraseña: 123456)')
  console.log('   - cajero@restaurante.com (contraseña: 123456)')
  console.log('   - mesero@restaurante.com (contraseña: 123456)')

  console.log('\n🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
