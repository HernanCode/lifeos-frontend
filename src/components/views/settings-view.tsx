'use client'

import { Bell, Moon, Palette, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ACCENT_CLASSES, type Accent } from '@/lib/app-data'
import { initials, useCurrentUser } from '@/lib/user-utils'

function Toggle({
  label,
  desc,
  defaultOn = false,
}: {
  label: string
  desc: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          on ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  )
}

const ACCENTS: Accent[] = ['purple', 'blue', 'green', 'orange', 'pink']

export function SettingsView() {
  const [accent, setAccent] = useState<Accent>('purple')
  const user = useCurrentUser()
  const displayName = user?.name ?? ''

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Configuración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Haz que Momentum se sienta tuyo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold">
            <User className="size-4 text-brand-purple" />
            Perfil
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-pink text-xl font-bold text-white">
              {user ? initials(user.name) : '…'}
            </div>
            <div>
              <p className="font-semibold">{user?.name ?? '—'}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email ?? '—'}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <label className="text-xs font-semibold text-muted-foreground">
              Nombre para mostrar
              <input
                readOnly
                value={displayName}
                className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Palette className="size-4 text-brand-blue" />
            Apariencia
          </div>
          <p className="text-sm font-semibold">Color de acento</p>
          <p className="text-xs text-muted-foreground">
            Elige el color que más te motive.
          </p>
          <div className="mt-3 flex gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a}
                onClick={() => setAccent(a)}
                aria-label={`Usar acento ${a}`}
                aria-pressed={accent === a}
                className={cn(
                  'size-9 rounded-full ring-offset-2 ring-offset-card transition-all',
                  ACCENT_CLASSES[a].bar,
                  accent === a && 'ring-2 ring-foreground',
                )}
              />
            ))}
          </div>
          <div className="mt-4 divide-y divide-border border-t border-border">
            <Toggle
              label="Modo oscuro"
              desc="Más cómodo para los ojos por la noche."
            />
            <Toggle
              label="Reducir movimiento"
              desc="Minimizar animaciones en toda la app."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Bell className="size-4 text-brand-green" />
            Notificaciones
          </div>
          <div className="divide-y divide-border">
            <Toggle
              label="Recordatorio diario del plan"
              desc="Un recordatorio suave cada mañana a las 8:00 AM."
              defaultOn
            />
            <Toggle
              label="Alertas de racha de hábitos"
              desc="No dejes que una racha se pierda."
              defaultOn
            />
            <Toggle
              label="Resumen semanal por email"
              desc="Tus victorias, cada domingo."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="size-4 text-brand-orange" />
            Privacidad y enfoque
          </div>
          <div className="divide-y divide-border">
            <Toggle
              label="Modo enfoque"
              desc="Ocultar elementos completados durante horas de trabajo."
              defaultOn
            />
            <Toggle
              label="Compartir progreso con el coach"
              desc="Permitir que tu compañero de rendición de cuentas vea las estadísticas."
            />
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-2">
                <Moon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Horas de silencio</p>
                  <p className="text-xs text-muted-foreground">
                    10:00 PM – 7:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
