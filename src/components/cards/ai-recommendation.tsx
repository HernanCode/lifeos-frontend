'use client'

import Image from 'next/image'
import { useState } from 'react'
import { RefreshCw, Sparkles, Wand2 } from 'lucide-react'

const SUGGESTIONS = [
  'Empieza con "Terminar la hoja de ruta del Q3" ahora — es tu tarea de mayor impacto y tienes una ventana clara de 90 minutos.',
  'Vas 2 libros por detrás de tu meta de lectura. Una sesión de 20 minutos esta noche mantiene tu racha.',
  'Ayer te saltaste el entrenamiento. Una carrera corta de 15 minutos te devolverá el impísin sin sobrecargar tu día.',
  'Agrupa la respuesta al inversionista con otros mensajes después del almuerzo para proteger tu bloque de enfoque de la mañana.',
]

export function AIRecommendation() {
  const [index, setIndex] = useState(0)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple via-primary to-brand-blue p-6 text-white">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 size-40 rounded-full bg-white/5" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              Asistente IA
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight text-balance">
            ¿Qué hago ahora?
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85 text-pretty">
            {SUGGESTIONS[index]}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5">
              <Wand2 className="size-4" />
              Empezar ahora
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % SUGGESTIONS.length)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/25"
            >
              <RefreshCw className="size-4" />
              Otra idea
            </button>
          </div>
        </div>

        <div className="mx-auto w-32 shrink-0 rounded-3xl bg-white/15 p-2 ring-1 ring-white/20 sm:w-40">
          <Image
            src="/illustrations/ai-buddy.png"
            alt="Mascota amigable del asistente IA"
            width={200}
            height={200}
            className="animate-float-soft rounded-2xl drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </div>
  )
}
