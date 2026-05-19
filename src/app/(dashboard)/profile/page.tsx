import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { getMyProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EditProfileForm } from './edit-profile-form'
import { ChangePasswordForm } from './change-password-form'
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
        <div className="h-32 sm:h-36 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500" />
        <CardContent className="-mt-14 sm:-mt-16 pb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar — sale sobre el banner naranja */}
            <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-background bg-muted ring-1 ring-border shadow-lg">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-foreground/70">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info — en desktop va al lado del avatar sobre el banner (texto blanco con sombra). En mobile cae bajo el avatar en área blanca (texto normal). */}
            <div className="min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground sm:text-white sm:[text-shadow:0_2px_4px_rgba(0,0,0,0.35)]">
                {profile.name}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground truncate sm:text-white/95 sm:[text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
                {profile.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge
                  variant="secondary"
                  className="gap-1 font-medium shadow-sm sm:bg-white/95 sm:text-foreground sm:hover:bg-white"
                >
                  <Shield className="h-3 w-3" />
                  {profile.role.displayName}
                </Badge>
                {profile.isActive ? (
                  <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 shadow-sm hover:bg-emerald-500/20 sm:bg-white/95 sm:text-emerald-700 sm:hover:bg-white dark:bg-emerald-500/20 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
        </CardContent>
      </Card>

      {/* Formulario de edición */}
      <EditProfileForm
        profile={{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        }}
      />

      {/* Cambio de contraseña */}
      <ChangePasswordForm />
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
