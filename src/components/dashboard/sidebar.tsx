'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { RESOURCES, ACTIONS } from '@/lib/rbac'
import {
  LayoutDashboard,
  Users,
  Shield,
  Package,
  FolderTree,
  ShoppingCart,
  UserCircle,
  Truck,
  UtensilsCrossed,
  Warehouse,
  Receipt,
  BarChart3,
  Settings,
  Globe,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  resource?: string
  action?: string
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Usuarios',
    href: '/users',
    icon: Users,
    resource: RESOURCES.USERS,
    action: ACTIONS.READ,
  },
  {
    title: 'Roles',
    href: '/roles',
    icon: Shield,
    resource: RESOURCES.ROLES,
    action: ACTIONS.READ,
  },
  {
    title: 'Productos',
    href: '/dashboard/products',
    icon: Package,
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.READ,
  },
  {
    title: 'Categorías',
    href: '/categories',
    icon: FolderTree,
    resource: RESOURCES.CATEGORIES,
    action: ACTIONS.READ,
  },
  {
    title: 'Ventas',
    href: '/dashboard/sales',
    icon: ShoppingCart,
    resource: RESOURCES.SALES,
    action: ACTIONS.READ,
  },
  {
    title: 'Clientes',
    href: '/dashboard/customers',
    icon: UserCircle,
    resource: RESOURCES.CUSTOMERS,
    action: ACTIONS.READ,
  },
  {
    title: 'Proveedores',
    href: '/dashboard/suppliers',
    icon: Truck,
    resource: RESOURCES.SUPPLIERS,
    action: ACTIONS.READ,
  },
  {
    title: 'Mesas',
    href: '/dashboard/tables',
    icon: UtensilsCrossed,
    resource: RESOURCES.TABLES,
    action: ACTIONS.READ,
  },
  {
    title: 'Inventario',
    href: '/dashboard/inventory',
    icon: Warehouse,
    resource: RESOURCES.INVENTORY,
    action: ACTIONS.READ,
  },
  {
    title: 'Gastos',
    href: '/dashboard/expenses',
    icon: Receipt,
    resource: RESOURCES.EXPENSES,
    action: ACTIONS.READ,
  },
  {
    title: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
    resource: RESOURCES.REPORTS,
    action: ACTIONS.READ,
  },
  {
    title: 'Pedidos Online',
    href: '/dashboard/online-orders',
    icon: Globe,
    resource: RESOURCES.ONLINE_ORDERS,
    action: ACTIONS.READ,
  },
  {
    title: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    resource: RESOURCES.SETTINGS,
    action: ACTIONS.READ,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { can } = usePermissions()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.resource || !item.action) return true
    return can(item.resource as any, item.action as any)
  })

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header del sidebar */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground">Restaurante</span>
              <span className="block text-xs text-sidebar-foreground/70">POS System</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 text-center">
            © {new Date().getFullYear()} Restaurante POS
          </p>
        </div>
      </aside>
    </>
  )
}
