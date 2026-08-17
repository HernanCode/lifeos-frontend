'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowUp, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { firstName, useCurrentUser } from '@/lib/user-utils'

type Message = { role: 'user' | 'assistant'; text: string }

const QUICK_PROMPTS = [
  '¿Qué debo hacer hoy?',
  'Planifica mi tarde',
  '¿Cómo van mis hábitos?',
  '¡Motívame!',
]

const CANNED: Record<string, string> = {
  default:
    'Basándome en tu día, empezaría por "Terminar la hoja de ruta del Q3" mientras tu energía está alta, y después haría las tareas pequeñas después del almuerzo. ¡Te faltan solo 2 tareas para un día perfecto!',
}

export function AssistantView() {
  const user = useCurrentUser()
  const greeting = useMemo(
    () =>
      user
        ? `¡Hola ${firstName(user.name)}! Soy tu asistente de productividad. Pregúntame qué hacer después, y te ayudo a planificar un día enfocado y equilibrado.`
        : '¡Hola! Soy tu asistente de productividad. Pregúntame qué hacer después, y te ayudo a planificar un día enfocado y equilibrado.',
    [user],
  )
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: greeting },
  ])
  const [input, setInput] = useState('')

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: CANNED.default },
    ])
    setInput('')
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Image
          src="/illustrations/ai-buddy.png"
          alt="Mascota del asistente IA"
          width={72}
          height={72}
          className="size-16 animate-float-soft"
        />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Asistente IA
          </h1>
          <p className="text-muted-foreground">
            Tu coach siempre disponible para un día enfocado y equilibrado.
          </p>
        </div>
      </div>

      <div className="flex min-h-[420px] flex-col rounded-3xl border border-border bg-card p-4 md:p-6">
        <div className="flex flex-1 flex-col gap-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'flex',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'rounded-br-lg bg-primary text-primary-foreground'
                    : 'rounded-bl-lg bg-accent text-accent-foreground',
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Sparkles className="size-3.5 text-brand-purple" />
              {p}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Pregúntale algo al asistente…"
            aria-label="Escribir mensaje al asistente"
            className="h-9 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => send(input)}
            aria-label="Enviar mensaje"
            className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            disabled={!input.trim()}
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
