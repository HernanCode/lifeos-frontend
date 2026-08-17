'use client'

import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { initials, useCurrentUser } from '@/lib/user-utils'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useCurrentUser()
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
      <button
        onClick={onMenu}
        aria-label="Abrir navegación"
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar tareas, metas, hábitos…"
          aria-label="Buscar"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button size="lg" className="h-10 rounded-xl px-4">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Nueva tarea</span>
        </Button>
        <button
          aria-label="Notificaciones"
          className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-pink ring-2 ring-card" />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1 pl-1 pr-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-orange to-brand-pink text-sm font-bold text-white">
            {user ? initials(user.name) : '…'}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold">{user?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">Plan Pro</p>
          </div>
        </div>
      </div>
    </header>
  )
}
