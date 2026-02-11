import { describe, it, expect } from 'vitest'
// Importar directamente desde los archivos específicos para evitar dependencias de Next.js
import { checkPermission } from '@/lib/rbac/check-permission'
import { ROLE_PERMISSIONS, RESOURCES, ACTIONS, ROLES } from '@/lib/rbac/permissions'

describe('RBAC - Role Based Access Control', () => {
  describe('checkPermission', () => {
    describe('ADMIN role', () => {
      it('should have all permissions', () => {
        Object.values(RESOURCES).forEach((resource) => {
          Object.values(ACTIONS).forEach((action) => {
            // Admin tiene todos los permisos excepto MANAGE en algunos recursos
            const adminPerms = ROLE_PERMISSIONS.ADMIN[resource as keyof typeof ROLE_PERMISSIONS.ADMIN]
            if (adminPerms && adminPerms.includes(action as never)) {
              expect(checkPermission('ADMIN', resource, action)).toBe(true)
            }
          })
        })
      })

      it('should be able to manage users', () => {
        expect(checkPermission('ADMIN', 'users', 'create')).toBe(true)
        expect(checkPermission('ADMIN', 'users', 'read')).toBe(true)
        expect(checkPermission('ADMIN', 'users', 'update')).toBe(true)
        expect(checkPermission('ADMIN', 'users', 'delete')).toBe(true)
      })

      it('should be able to manage roles', () => {
        expect(checkPermission('ADMIN', 'roles', 'create')).toBe(true)
        expect(checkPermission('ADMIN', 'roles', 'read')).toBe(true)
        expect(checkPermission('ADMIN', 'roles', 'update')).toBe(true)
        expect(checkPermission('ADMIN', 'roles', 'delete')).toBe(true)
      })

      it('should be able to manage settings', () => {
        expect(checkPermission('ADMIN', 'settings', 'create')).toBe(true)
        expect(checkPermission('ADMIN', 'settings', 'read')).toBe(true)
        expect(checkPermission('ADMIN', 'settings', 'update')).toBe(true)
        expect(checkPermission('ADMIN', 'settings', 'delete')).toBe(true)
      })
    })

    describe('MANAGER role', () => {
      it('should be able to read users but not create or delete', () => {
        expect(checkPermission('MANAGER', 'users', 'read')).toBe(true)
        expect(checkPermission('MANAGER', 'users', 'update')).toBe(true)
        expect(checkPermission('MANAGER', 'users', 'create')).toBe(false)
        expect(checkPermission('MANAGER', 'users', 'delete')).toBe(false)
      })

      it('should only be able to read roles', () => {
        expect(checkPermission('MANAGER', 'roles', 'read')).toBe(true)
        expect(checkPermission('MANAGER', 'roles', 'create')).toBe(false)
        expect(checkPermission('MANAGER', 'roles', 'update')).toBe(false)
        expect(checkPermission('MANAGER', 'roles', 'delete')).toBe(false)
      })

      it('should be able to manage products', () => {
        expect(checkPermission('MANAGER', 'products', 'create')).toBe(true)
        expect(checkPermission('MANAGER', 'products', 'read')).toBe(true)
        expect(checkPermission('MANAGER', 'products', 'update')).toBe(true)
        expect(checkPermission('MANAGER', 'products', 'delete')).toBe(true)
      })

      it('should be able to manage sales', () => {
        expect(checkPermission('MANAGER', 'sales', 'create')).toBe(true)
        expect(checkPermission('MANAGER', 'sales', 'read')).toBe(true)
        expect(checkPermission('MANAGER', 'sales', 'update')).toBe(true)
        expect(checkPermission('MANAGER', 'sales', 'delete')).toBe(true)
      })

      it('should only read and update settings', () => {
        expect(checkPermission('MANAGER', 'settings', 'read')).toBe(true)
        expect(checkPermission('MANAGER', 'settings', 'update')).toBe(true)
        expect(checkPermission('MANAGER', 'settings', 'create')).toBe(false)
        expect(checkPermission('MANAGER', 'settings', 'delete')).toBe(false)
      })
    })

    describe('CASHIER role', () => {
      it('should be able to read products but not modify', () => {
        expect(checkPermission('CASHIER', 'products', 'read')).toBe(true)
        expect(checkPermission('CASHIER', 'products', 'create')).toBe(false)
        expect(checkPermission('CASHIER', 'products', 'update')).toBe(false)
        expect(checkPermission('CASHIER', 'products', 'delete')).toBe(false)
      })

      it('should be able to create and read sales', () => {
        expect(checkPermission('CASHIER', 'sales', 'create')).toBe(true)
        expect(checkPermission('CASHIER', 'sales', 'read')).toBe(true)
        expect(checkPermission('CASHIER', 'sales', 'update')).toBe(false)
        expect(checkPermission('CASHIER', 'sales', 'delete')).toBe(false)
      })

      it('should be able to manage customers', () => {
        expect(checkPermission('CASHIER', 'customers', 'create')).toBe(true)
        expect(checkPermission('CASHIER', 'customers', 'read')).toBe(true)
        expect(checkPermission('CASHIER', 'customers', 'update')).toBe(true)
        expect(checkPermission('CASHIER', 'customers', 'delete')).toBe(false)
      })

      it('should not have access to roles management', () => {
        expect(checkPermission('CASHIER', 'roles', 'read')).toBe(false)
        expect(checkPermission('CASHIER', 'roles', 'create')).toBe(false)
        expect(checkPermission('CASHIER', 'roles', 'update')).toBe(false)
        expect(checkPermission('CASHIER', 'roles', 'delete')).toBe(false)
      })

      it('should not have access to settings', () => {
        expect(checkPermission('CASHIER', 'settings', 'read')).toBe(false)
        expect(checkPermission('CASHIER', 'settings', 'create')).toBe(false)
        expect(checkPermission('CASHIER', 'settings', 'update')).toBe(false)
        expect(checkPermission('CASHIER', 'settings', 'delete')).toBe(false)
      })
    })

    describe('WAITER role', () => {
      it('should be able to read products', () => {
        expect(checkPermission('WAITER', 'products', 'read')).toBe(true)
        expect(checkPermission('WAITER', 'products', 'create')).toBe(false)
        expect(checkPermission('WAITER', 'products', 'update')).toBe(false)
        expect(checkPermission('WAITER', 'products', 'delete')).toBe(false)
      })

      it('should be able to create and read sales', () => {
        expect(checkPermission('WAITER', 'sales', 'create')).toBe(true)
        expect(checkPermission('WAITER', 'sales', 'read')).toBe(true)
        expect(checkPermission('WAITER', 'sales', 'update')).toBe(false)
        expect(checkPermission('WAITER', 'sales', 'delete')).toBe(false)
      })

      it('should be able to read and update tables', () => {
        expect(checkPermission('WAITER', 'tables', 'read')).toBe(true)
        expect(checkPermission('WAITER', 'tables', 'update')).toBe(true)
        expect(checkPermission('WAITER', 'tables', 'create')).toBe(false)
        expect(checkPermission('WAITER', 'tables', 'delete')).toBe(false)
      })

      it('should not have access to users management', () => {
        expect(checkPermission('WAITER', 'users', 'read')).toBe(false)
        expect(checkPermission('WAITER', 'users', 'create')).toBe(false)
        expect(checkPermission('WAITER', 'users', 'update')).toBe(false)
        expect(checkPermission('WAITER', 'users', 'delete')).toBe(false)
      })

      it('should not have access to inventory', () => {
        expect(checkPermission('WAITER', 'inventory', 'read')).toBe(false)
        expect(checkPermission('WAITER', 'inventory', 'create')).toBe(false)
        expect(checkPermission('WAITER', 'inventory', 'update')).toBe(false)
        expect(checkPermission('WAITER', 'inventory', 'delete')).toBe(false)
      })
    })

    describe('USER role', () => {
      it('should only be able to read products and categories', () => {
        expect(checkPermission('USER', 'products', 'read')).toBe(true)
        expect(checkPermission('USER', 'categories', 'read')).toBe(true)
      })

      it('should not be able to modify products', () => {
        expect(checkPermission('USER', 'products', 'create')).toBe(false)
        expect(checkPermission('USER', 'products', 'update')).toBe(false)
        expect(checkPermission('USER', 'products', 'delete')).toBe(false)
      })

      it('should not have access to sales', () => {
        expect(checkPermission('USER', 'sales', 'read')).toBe(false)
        expect(checkPermission('USER', 'sales', 'create')).toBe(false)
      })

      it('should not have access to any sensitive resources', () => {
        expect(checkPermission('USER', 'users', 'read')).toBe(false)
        expect(checkPermission('USER', 'roles', 'read')).toBe(false)
        expect(checkPermission('USER', 'settings', 'read')).toBe(false)
        expect(checkPermission('USER', 'inventory', 'read')).toBe(false)
        expect(checkPermission('USER', 'expenses', 'read')).toBe(false)
      })
    })

    describe('Invalid inputs', () => {
      it('should return false for invalid role', () => {
        expect(checkPermission('INVALID_ROLE', 'products', 'read')).toBe(false)
        expect(checkPermission('', 'products', 'read')).toBe(false)
      })

      it('should return false for invalid resource', () => {
        expect(checkPermission('ADMIN', 'invalid_resource', 'read')).toBe(false)
      })

      it('should return false for invalid action', () => {
        expect(checkPermission('ADMIN', 'products', 'invalid_action')).toBe(false)
      })
    })
  })

  describe('ROLE_PERMISSIONS structure', () => {
    it('should have all defined roles', () => {
      expect(ROLES).toContain('ADMIN')
      expect(ROLES).toContain('MANAGER')
      expect(ROLES).toContain('CASHIER')
      expect(ROLES).toContain('WAITER')
      expect(ROLES).toContain('USER')
    })

    it('should have ADMIN with most permissions', () => {
      const adminPermsCount = Object.values(ROLE_PERMISSIONS.ADMIN).reduce(
        (acc, perms) => acc + perms.length,
        0
      )
      const managerPermsCount = Object.values(ROLE_PERMISSIONS.MANAGER).reduce(
        (acc, perms) => acc + perms.length,
        0
      )

      expect(adminPermsCount).toBeGreaterThan(managerPermsCount)
    })

    it('should have USER with least permissions', () => {
      const userPermsCount = Object.values(ROLE_PERMISSIONS.USER).reduce(
        (acc, perms) => acc + perms.length,
        0
      )

      ROLES.filter((r) => r !== 'USER').forEach((role) => {
        const rolePermsCount = Object.values(ROLE_PERMISSIONS[role]).reduce(
          (acc, perms) => acc + perms.length,
          0
        )
        expect(rolePermsCount).toBeGreaterThanOrEqual(userPermsCount)
      })
    })
  })

  describe('RESOURCES', () => {
    it('should have all expected resources', () => {
      expect(RESOURCES.USERS).toBe('users')
      expect(RESOURCES.ROLES).toBe('roles')
      expect(RESOURCES.PRODUCTS).toBe('products')
      expect(RESOURCES.CATEGORIES).toBe('categories')
      expect(RESOURCES.SALES).toBe('sales')
      expect(RESOURCES.CUSTOMERS).toBe('customers')
      expect(RESOURCES.SUPPLIERS).toBe('suppliers')
      expect(RESOURCES.TABLES).toBe('tables')
      expect(RESOURCES.INVENTORY).toBe('inventory')
      expect(RESOURCES.EXPENSES).toBe('expenses')
      expect(RESOURCES.REPORTS).toBe('reports')
      expect(RESOURCES.SETTINGS).toBe('settings')
      expect(RESOURCES.ONLINE_ORDERS).toBe('online_orders')
    })
  })

  describe('ACTIONS', () => {
    it('should have all CRUD actions', () => {
      expect(ACTIONS.CREATE).toBe('create')
      expect(ACTIONS.READ).toBe('read')
      expect(ACTIONS.UPDATE).toBe('update')
      expect(ACTIONS.DELETE).toBe('delete')
      expect(ACTIONS.MANAGE).toBe('manage')
    })
  })
})
