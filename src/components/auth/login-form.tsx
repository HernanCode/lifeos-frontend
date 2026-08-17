'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthField } from '@/components/auth/auth-field'
import { authService } from '@/lib/services/authService'
import useAuthStore from '@/store/authStore'

export function LoginForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { user, token } = await authService.login(formData)
      setAuth(user, token)
      router.push('/')
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Error al iniciar sesión.')
          : 'Error al iniciar sesión.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <div className="mb-8 lg:hidden">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
            M
          </div>
          <span className="text-lg font-bold tracking-tight">Momentum</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-balance">
        Bienvenido de nuevo
      </h1>
      <p className="mt-2 text-muted-foreground">
        Inicia sesión para retomar tu progreso.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <AuthField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          icon={Mail}
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <AuthField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        {error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-border text-primary accent-primary"
            />
            Recuérdame
          </label>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 h-12 rounded-xl text-base"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}
