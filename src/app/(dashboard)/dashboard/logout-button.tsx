'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Saliendo...' : 'Cerrar sesión'}
    </Button>
  )
}
