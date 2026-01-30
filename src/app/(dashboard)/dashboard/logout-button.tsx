'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const clearLocalData = () => {
    // Limpiar localStorage
    localStorage.clear()

    // Limpiar sessionStorage
    sessionStorage.clear()

    // Limpiar cookies del cliente (excepto las httpOnly que maneja el servidor)
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })

    // Limpiar cache de la aplicación si está disponible
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    // Limpiar datos locales/cache
    clearLocalData()

    // Mostrar toast de despedida
    toast.success('¡Hasta pronto!', {
      description: 'Has cerrado sesión correctamente.',
      duration: 2000,
    })

    // Esperar un momento para que se vea el toast
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Cerrar sesión y redirigir al login
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de cerrar tu sesión. Tendrás que volver a iniciar sesión para acceder al
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Cerrando sesión...' : 'Sí, cerrar sesión'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
