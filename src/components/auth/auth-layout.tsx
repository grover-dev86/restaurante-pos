import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { UtensilsCrossed, ChefHat, Utensils, Coffee } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  showLogo?: boolean
  footerLink?: {
    text: string
    href: string
  }
}

export function AuthLayout({
  children,
  title,
  description,
  showLogo = true,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Decorativo (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        {/* Patrón decorativo - círculos */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl" />
        </div>

        {/* Íconos decorativos flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          <ChefHat className="absolute top-20 right-20 h-16 w-16 text-white/10 rotate-12" />
          <Utensils className="absolute bottom-32 left-16 h-20 w-20 text-white/10 -rotate-12" />
          <Coffee className="absolute top-1/3 right-1/4 h-12 w-12 text-white/10 rotate-6" />
        </div>

        {/* Contenido decorativo */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <UtensilsCrossed className="h-9 w-9 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold text-white">Restaurante</span>
              <span className="block text-xl font-medium text-white/80">POS System</span>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Gestiona tu negocio
            <span className="block text-yellow-200">de forma inteligente</span>
          </h2>
          <p className="text-lg text-white/90 max-w-md">
            Sistema completo para restaurantes. Ventas, inventario, pedidos, reportes y mucho más
            en un solo lugar.
          </p>

          {/* Features con íconos */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: '🍽️', text: 'Gestión de mesas' },
              { icon: '📊', text: 'Reportes en tiempo real' },
              { icon: '👥', text: 'Multi-usuario' },
              { icon: '📱', text: 'Acceso móvil' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-orange-50/50 to-amber-50/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          {showLogo && (
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">Restaurante</span>
                <span className="block text-sm font-medium text-orange-600">POS System</span>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-2xl shadow-orange-500/10 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-center text-gray-800">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-base">{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              {children}

              {footerLink && (
                <div className="mt-6 text-center">
                  <Link
                    href={footerLink.href}
                    className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    {footerLink.text}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Restaurante POS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
