# Sistema RBAC (Role-Based Access Control)

Sistema de control de acceso basado en roles para el POS de restaurante.

## 📋 Roles Disponibles

### ADMIN (Administrador)

- Acceso completo al sistema
- Puede gestionar usuarios, roles y permisos
- Acceso a todas las configuraciones

### MANAGER (Gerente)

- Gestión operativa completa
- Puede ver y editar productos, ventas, inventario
- No puede eliminar usuarios ni modificar roles

### CASHIER (Cajero)

- Acceso al sistema POS
- Puede crear ventas y gestionar clientes
- Solo lectura en productos y reportes

### WAITER (Mesero)

- Tomar órdenes y gestionar mesas
- Acceso a productos y categorías (solo lectura)
- Puede crear ventas

### USER (Usuario)

- Acceso básico de solo lectura
- Ver productos y categorías

## 🔑 Recursos y Permisos

Cada recurso puede tener las siguientes acciones:

- `create` - Crear nuevos registros
- `read` - Leer/ver registros
- `update` - Actualizar registros
- `delete` - Eliminar registros

### Recursos disponibles:

- `users` - Usuarios del sistema
- `roles` - Roles y permisos
- `products` - Productos
- `categories` - Categorías
- `sales` - Ventas
- `customers` - Clientes
- `suppliers` - Proveedores
- `tables` - Mesas
- `inventory` - Inventario
- `expenses` - Gastos
- `reports` - Reportes
- `settings` - Configuración
- `online_orders` - Pedidos online

## 💻 Uso en el Código

### En Componentes del Cliente

```tsx
import { Can } from '@/components/can'
import { RESOURCES, ACTIONS } from '@/lib/rbac'

function MyComponent() {
  return (
    <Can resource={RESOURCES.PRODUCTS} action={ACTIONS.CREATE}>
      <button>Crear Producto</button>
    </Can>
  )
}
```

### Con Hook personalizado

```tsx
import { usePermission } from '@/hooks/use-permission'
import { RESOURCES, ACTIONS } from '@/lib/rbac'

function MyComponent() {
  const canCreateProduct = usePermission(RESOURCES.PRODUCTS, ACTIONS.CREATE)

  return canCreateProduct ? <button>Crear Producto</button> : null
}
```

### En Server Components

```tsx
import { requirePermission, RESOURCES, ACTIONS } from '@/lib/rbac'

export default async function ProductsPage() {
  // Lanza error si no tiene permiso
  await requirePermission(RESOURCES.PRODUCTS, ACTIONS.READ)

  return <div>Lista de productos</div>
}
```

### En API Routes

```ts
import { requirePermission, RESOURCES, ACTIONS } from '@/lib/rbac'

export async function POST(request: Request) {
  // Verificar permiso
  await requirePermission(RESOURCES.PRODUCTS, ACTIONS.CREATE)

  // ... lógica de creación
}
```

### Verificación sin lanzar error

```tsx
import { hasPermission, RESOURCES, ACTIONS } from '@/lib/rbac/server-permissions'

export default async function ProductsPage() {
  const canEdit = await hasPermission(RESOURCES.PRODUCTS, ACTIONS.UPDATE)

  return (
    <div>
      {canEdit && <button>Editar</button>}
      {/* ... */}
    </div>
  )
}
```

## 🌱 Seed de Datos

Para crear los roles y permisos iniciales en la base de datos:

```bash
npm run seed:roles
```

O manualmente:

```ts
import { seedRolesAndPermissions } from '@/lib/rbac/seed-roles'

await seedRolesAndPermissions()
```

## 🔧 Agregar Nuevos Permisos

1. Edita `src/lib/rbac/permissions.ts`
2. Agrega el nuevo recurso a `RESOURCES`
3. Define los permisos en `ROLE_PERMISSIONS` para cada rol
4. Ejecuta el seed para actualizar la BD

## 📊 Matriz de Permisos

| Recurso       | Admin | Manager | Cashier | Waiter | User |
| ------------- | ----- | ------- | ------- | ------ | ---- |
| Users         | CRUD  | RU      | R       | -      | -    |
| Roles         | CRUD  | R       | -       | -      | -    |
| Products      | CRUD  | CRUD    | R       | R      | R    |
| Categories    | CRUD  | CRUD    | R       | R      | R    |
| Sales         | CRUD  | CRUD    | CR      | CR     | -    |
| Customers     | CRUD  | CRUD    | CRU     | R      | -    |
| Suppliers     | CRUD  | CRUD    | -       | -      | -    |
| Tables        | CRUD  | CRUD    | RU      | RU     | -    |
| Inventory     | CRUD  | CRUD    | -       | -      | -    |
| Expenses      | CRUD  | CRUD    | -       | -      | -    |
| Reports       | R     | R       | R       | -      | -    |
| Settings      | CRUD  | RU      | -       | -      | -    |
| Online Orders | CRUD  | RU      | R       | R      | -    |

_C=Create, R=Read, U=Update, D=Delete_
