'use client'

import { useSession } from 'next-auth/react'
import { LogoutButton } from '@/app/(dashboard)/dashboard/logout-button'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()

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

        {/* Usuario y logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{session?.user?.role}</p>
          </div>
          {/* Avatar móvil */}
          <div className="sm:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
