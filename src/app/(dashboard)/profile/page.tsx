import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { getMyProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  Clock,
  ShoppingCart,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mi perfil | Restaurante POS',
  description: 'Información personal y estadísticas',
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))
}

function formatDateShort(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date(date))
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await getMyProfile()

  return (
    <div className="min-w-0 space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Mi perfil
        </h1>
        <p className="text-muted-foreground mt-1">
          Tu información personal y estadísticas de actividad
        </p>
      </div>

      {/* Card "hero" del perfil */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-orange-500 to-amber-500" />
        <CardContent className="-mt-12 pb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar grande */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-background bg-muted shadow-md">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info principal */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {profile.role.displayName}
                </Badge>
                {profile.isActive ? (
                  <Badge className="bg-green-500/90 text-white hover:bg-green-500">
                    Cuenta activa
                  </Badge>
                ) : (
                  <Badge variant="destructive">Cuenta inactiva</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile._count.sales}</div>
            <p className="text-xs text-muted-foreground">Realizadas desde el ingreso</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas este mes</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {profile.salesThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">Completadas en el mes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile._count.activities}</div>
            <p className="text-xs text-muted-foreground">Acciones registradas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última sesión</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {profile.lastLoginAt ? formatDateShort(profile.lastLoginAt) : 'Nunca'}
            </div>
            <p className="text-xs text-muted-foreground">Última vez activo</p>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <ProfileField icon={UserIcon} label="Nombre completo" value={profile.name} />
            <ProfileField icon={Mail} label="Email" value={profile.email} />
            <ProfileField
              icon={Phone}
              label="Teléfono"
              value={profile.phone || 'No registrado'}
              muted={!profile.phone}
            />
            <ProfileField icon={Shield} label="Rol" value={profile.role.displayName} />
            <ProfileField
              icon={Calendar}
              label="Miembro desde"
              value={formatDateShort(profile.createdAt)}
            />
            <ProfileField
              icon={Clock}
              label="Última actualización"
              value={formatDate(profile.updatedAt)}
            />
          </dl>

          {/* Hint para próxima subtarea */}
          <div className="mt-6 rounded-md border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            🛠️ Los formularios de <strong>editar perfil</strong> y{' '}
            <strong>cambiar contraseña</strong> se conectarán en las próximas subtareas.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileField({
  icon: Icon,
  label,
  value,
  muted = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className={`mt-0.5 text-sm ${muted ? 'italic text-muted-foreground' : 'font-medium'}`}>
          {value}
        </dd>
      </div>
    </div>
  )
}
