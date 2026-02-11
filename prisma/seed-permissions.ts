import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Definición de recursos y acciones
const RESOURCES = [
  'users',
  'roles',
  'products',
  'categories',
  'sales',
  'customers',
  'suppliers',
  'tables',
  'inventory',
  'expenses',
  'reports',
  'settings',
  'online_orders',
] as const

const ACTIONS = ['create', 'read', 'update', 'delete'] as const

// Nombres amigables
const resourceNames: Record<string, string> = {
  users: 'Usuarios',
  roles: 'Roles',
  products: 'Productos',
  categories: 'Categorías',
  sales: 'Ventas',
  customers: 'Clientes',
  suppliers: 'Proveedores',
  tables: 'Mesas',
  inventory: 'Inventario',
  expenses: 'Gastos',
  reports: 'Reportes',
  settings: 'Configuración',
  online_orders: 'Pedidos Online',
}

const actionNames: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Editar',
  delete: 'Eliminar',
}

// Permisos por rol
const rolePermissions: Record<string, { resource: string; action: string }[]> = {
  ADMIN: RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({ resource, action }))
  ),
  MANAGER: [
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'roles', action: 'read' },
    { resource: 'products', action: 'create' },
    { resource: 'products', action: 'read' },
    { resource: 'products', action: 'update' },
    { resource: 'products', action: 'delete' },
    { resource: 'categories', action: 'create' },
    { resource: 'categories', action: 'read' },
    { resource: 'categories', action: 'update' },
    { resource: 'categories', action: 'delete' },
    { resource: 'sales', action: 'create' },
    { resource: 'sales', action: 'read' },
    { resource: 'sales', action: 'update' },
    { resource: 'sales', action: 'delete' },
    { resource: 'customers', action: 'create' },
    { resource: 'customers', action: 'read' },
    { resource: 'customers', action: 'update' },
    { resource: 'customers', action: 'delete' },
    { resource: 'suppliers', action: 'create' },
    { resource: 'suppliers', action: 'read' },
    { resource: 'suppliers', action: 'update' },
    { resource: 'suppliers', action: 'delete' },
    { resource: 'tables', action: 'create' },
    { resource: 'tables', action: 'read' },
    { resource: 'tables', action: 'update' },
    { resource: 'tables', action: 'delete' },
    { resource: 'inventory', action: 'create' },
    { resource: 'inventory', action: 'read' },
    { resource: 'inventory', action: 'update' },
    { resource: 'inventory', action: 'delete' },
    { resource: 'expenses', action: 'create' },
    { resource: 'expenses', action: 'read' },
    { resource: 'expenses', action: 'update' },
    { resource: 'expenses', action: 'delete' },
    { resource: 'reports', action: 'read' },
    { resource: 'settings', action: 'read' },
    { resource: 'settings', action: 'update' },
    { resource: 'online_orders', action: 'read' },
    { resource: 'online_orders', action: 'update' },
  ],
  CASHIER: [
    { resource: 'users', action: 'read' },
    { resource: 'products', action: 'read' },
    { resource: 'categories', action: 'read' },
    { resource: 'sales', action: 'create' },
    { resource: 'sales', action: 'read' },
    { resource: 'customers', action: 'create' },
    { resource: 'customers', action: 'read' },
    { resource: 'customers', action: 'update' },
    { resource: 'tables', action: 'read' },
    { resource: 'tables', action: 'update' },
    { resource: 'reports', action: 'read' },
    { resource: 'online_orders', action: 'read' },
  ],
  WAITER: [
    { resource: 'products', action: 'read' },
    { resource: 'categories', action: 'read' },
    { resource: 'sales', action: 'create' },
    { resource: 'sales', action: 'read' },
    { resource: 'customers', action: 'read' },
    { resource: 'tables', action: 'read' },
    { resource: 'tables', action: 'update' },
    { resource: 'online_orders', action: 'read' },
  ],
  USER: [
    { resource: 'products', action: 'read' },
    { resource: 'categories', action: 'read' },
  ],
}

// Información de roles
const roleInfo: Record<string, { displayName: string; description: string }> = {
  ADMIN: {
    displayName: 'Administrador',
    description: 'Acceso completo a todas las funciones del sistema',
  },
  MANAGER: {
    displayName: 'Gerente',
    description: 'Gestión de operaciones, empleados y reportes',
  },
  CASHIER: {
    displayName: 'Cajero',
    description: 'Punto de venta, cobros y atención al cliente',
  },
  WAITER: {
    displayName: 'Mesero',
    description: 'Toma de órdenes y gestión de mesas',
  },
  USER: {
    displayName: 'Usuario',
    description: 'Acceso básico de solo lectura',
  },
}

async function seedPermissions() {
  console.log('🔐 Iniciando seed de permisos...\n')

  // 1. Crear todos los permisos
  console.log('📝 Creando permisos...')
  const permissions: { id: string; resource: string; action: string }[] = []

  for (const resource of RESOURCES) {
    for (const action of ACTIONS) {
      const description = `${actionNames[action]} ${resourceNames[resource]}`

      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action,
          },
        },
        update: { description },
        create: {
          resource,
          action,
          description,
        },
      })
      permissions.push(permission)
      console.log(`  ✓ ${description}`)
    }
  }

  console.log(`\n✅ ${permissions.length} permisos creados/actualizados\n`)

  // 2. Crear roles con sus permisos
  console.log('👥 Creando roles...')

  for (const [roleName, info] of Object.entries(roleInfo)) {
    const rolePerms = rolePermissions[roleName] || []

    // Obtener IDs de los permisos para este rol
    const permissionIds = permissions
      .filter((p) =>
        rolePerms.some((rp) => rp.resource === p.resource && rp.action === p.action)
      )
      .map((p) => ({ id: p.id }))

    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        displayName: info.displayName,
        description: info.description,
        permissions: {
          set: permissionIds,
        },
      },
      create: {
        name: roleName,
        displayName: info.displayName,
        description: info.description,
        permissions: {
          connect: permissionIds,
        },
      },
    })

    console.log(`  ✓ ${role.displayName} (${role.name}) - ${permissionIds.length} permisos`)
  }

  console.log('\n✅ Seed de permisos completado exitosamente!')
}

seedPermissions()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
