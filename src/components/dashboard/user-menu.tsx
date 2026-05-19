'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { User as UserIcon, LogOut, ChevronDown } from 'lucide-react'

function clearLocalData() {
  // Limpiar localStorage y sessionStorage
  localStorage.clear()
  sessionStorage.clear()

  // Limpiar cookies del cliente (las httpOnly las maneja el servidor)
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })

  // Limpiar cache de la app si está disponible
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name))
    })
  }
}

export function UserMenu() {
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    clearLocalData()
    toast.success('¡Hasta pronto!', {
      description: 'Has cerrado sesión correctamente.',
      duration: 2000,
    })
    await new Promise((resolve) => setTimeout(resolve, 800))
    await signOut({ callbackUrl: '/login' })
  }

  const name = session?.user?.name ?? 'Usuario'
  const email = session?.user?.email ?? ''
  const role = session?.user?.role ?? ''
  const initial = name.charAt(0).toUpperCase()
  // TODO: para mostrar el avatar real en el header habría que incluir
  // user.avatar en el callback de session (auth.config.ts). Por ahora
  // mostramos la inicial; el avatar completo se ve en /profile.

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 sm:gap-3 rounded-full p-1 sm:py-1 sm:pr-3 sm:pl-1 hover:bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Avatar (inicial) */}
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-primary/10 text-primary">
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                {initial}
              </div>
            </div>

            {/* Nombre + rol (solo en desktop) */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground capitalize leading-tight">{role}</p>
            </div>

            <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="mt-1 text-xs leading-none text-muted-foreground truncate">
              {email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              Mi perfil
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault() // mantiene el menú cerrado pero deja abrir el dialog
              setLogoutOpen(true)
            }}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={logoutOpen}
        onOpenChange={isLoggingOut ? undefined : setLogoutOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de cerrar tu sesión. Tendrás que volver a iniciar sesión
              para acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Cerrando sesión…' : 'Sí, cerrar sesión'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
