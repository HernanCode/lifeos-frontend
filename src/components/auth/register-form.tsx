'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthField } from '@/components/auth/auth-field'
import { authService } from '@/lib/services/authService'
import useAuthStore from '@/store/authStore'

export function RegisterForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const { user, token } = await authService.register(formData)
      setAuth(user, token)
      router.push('/')
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Error al registrarse.')
          : 'Error al registrarse.'
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
        Crea tu cuenta
      </h1>
      <p className="mt-2 text-muted-foreground">
        Empieza a organizar tu día en menos de un minuto.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <AuthField
          id="name"
          label="Nombre completo"
          placeholder="Alex Rivera"
          icon={User}
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
        />
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
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        <AuthField
          id="password_confirmation"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          autoComplete="new-password"
          value={formData.password_confirmation}
          onChange={handleChange}
        />

        {error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-border text-primary accent-primary"
          />
          <span>
            Acepto los{' '}
            <button type="button" className="font-medium text-primary hover:underline">
              Términos
            </button>{' '}
            y la{' '}
            <button type="button" className="font-medium text-primary hover:underline">
              Política de privacidad
            </button>
            .
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 h-12 rounded-xl text-base"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Crear cuenta
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
