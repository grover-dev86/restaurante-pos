import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | Restaurante POS',
  description: 'Panel de control del sistema',
}

export default async function DashboardPage() {
  const session = await auth()

  const stats = [
    {
      title: 'Ventas Hoy',
      value: 'S/ 0.00',
      description: 'Próximamente: reportes en tiempo real',
      icon: DollarSign,
      trend: '+0%',
      trendUp: true,
    },
    {
      title: 'Pedidos',
      value: '0',
      description: 'Próximamente: gestión de pedidos',
      icon: ShoppingBag,
      trend: '+0%',
      trendUp: true,
    },
    {
      title: 'Productos',
      value: '0',
      description: 'Próximamente: catálogo de productos',
      icon: Package,
      trend: '0 activos',
      trendUp: null,
    },
    {
      title: 'Mesas Activas',
      value: '0/0',
      description: 'Próximamente: gestión de mesas',
      icon: Users,
      trend: 'Disponibles',
      trendUp: null,
    },
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Bienvenido, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Este es tu panel de control. Gestiona todas las operaciones del restaurante.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                {stat.trendUp !== null && (
                  <span
                    className={`flex items-center text-xs font-medium ${
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendingUp
                      className={`h-3 w-3 mr-1 ${!stat.trendUp ? 'rotate-180' : ''}`}
                    />
                    {stat.trend}
                  </span>
                )}
                {stat.trendUp === null && (
                  <span className="text-xs text-muted-foreground">{stat.trend}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Info Card */}
      <div className="mt-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Información de la sesión</CardTitle>
                <CardDescription>Detalles de tu cuenta actual</CardDescription>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nombre
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {session?.user?.name}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground truncate">
                  {session?.user?.email}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rol
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                    {session?.user?.role}
                  </span>
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID de Usuario
                </dt>
                <dd className="mt-1 text-xs font-mono text-muted-foreground truncate">
                  {session?.user?.id}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
