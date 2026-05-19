'use client'

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { UserMenu } from './user-menu'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Botón menú móvil */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Espaciador en desktop */}
        <div className="hidden lg:block" />

        {/* Menú de usuario (avatar + dropdown con Mi perfil / Cerrar sesión) */}
        <UserMenu />
      </div>
    </header>
  )
}
