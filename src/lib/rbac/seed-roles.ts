/**
 * Script para crear roles y permisos iniciales en la base de datos
 */
import { prisma } from '@/lib/prisma'
import { ROLE_PERMISSIONS, ROLES } from './permissions'

export async function seedRolesAndPermissions() {
  console.log('🌱 Seeding roles and permissions...')

  try {
    // Crear todos los permisos únicos
    const allPermissions = new Set<string>()

    Object.values(ROLE_PERMISSIONS).forEach((rolePerms) => {
      Object.entries(rolePerms).forEach(([resource, actions]) => {
        actions.forEach((action) => {
          allPermissions.add(`${resource}:${action}`)
        })
      })
    })

    // Insertar permisos en la base de datos
    for (const perm of allPermissions) {
      const [resource, action] = perm.split(':')

      await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action,
          },
        },
        update: {},
        create: {
          resource,
          action,
          description: `${action} ${resource}`,
        },
      })
    }

    console.log(`✅ Created ${allPermissions.size} permissions`)

    // Crear roles y asignar permisos
    for (const roleName of ROLES) {
      const rolePerms = ROLE_PERMISSIONS[roleName]

      // Obtener IDs de permisos para este rol
      const permissionIds: string[] = []

      for (const [resource, actions] of Object.entries(rolePerms)) {
        for (const action of actions) {
          const permission = await prisma.permission.findUnique({
            where: {
              resource_action: {
                resource,
                action,
              },
            },
          })

          if (permission) {
            permissionIds.push(permission.id)
          }
        }
      }

      // Crear o actualizar rol
      await prisma.role.upsert({
        where: { name: roleName },
        update: {
          permissions: {
            set: permissionIds.map((id) => ({ id })),
          },
        },
        create: {
          name: roleName,
          displayName: roleName.charAt(0) + roleName.slice(1).toLowerCase(),
          description: `${roleName} role with predefined permissions`,
          permissions: {
            connect: permissionIds.map((id) => ({ id })),
          },
        },
      })

      console.log(`✅ Created/Updated role: ${roleName} with ${permissionIds.length} permissions`)
    }

    console.log('✅ Roles and permissions seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding roles and permissions:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedRolesAndPermissions()
    .then(() => {
      console.log('✅ Done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}
