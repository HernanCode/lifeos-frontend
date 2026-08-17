import Image from 'next/image'
import { CheckCircle2, Flame, Sparkles } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: CheckCircle2,
    title: 'Organiza tu día',
    text: 'Tareas, metas y hábitos en un solo lugar.',
  },
  {
    icon: Flame,
    title: 'Mantén tu racha',
    text: 'Construye hábitos con seguimiento diario.',
  },
  {
    icon: Sparkles,
    title: 'Asistente con IA',
    text: 'Recibe sugerencias sobre qué hacer a continuación.',
  },
]

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-purple via-brand-blue to-brand-blue p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-brand-pink/30 blur-3xl"
      />

      <div className="relative flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold ring-1 ring-white/30">
          M
        </div>
        <span className="text-xl font-bold tracking-tight">Momentum</span>
      </div>

      <div className="relative">
        <div className="mb-8 w-44 rounded-3xl bg-white/15 p-3 ring-1 ring-white/20">
          <Image
            src="/illustrations/ai-buddy.png"
            alt="Mascota asistente de Momentum"
            width={200}
            height={200}
            className="animate-float-soft rounded-2xl drop-shadow-xl"
            priority
          />
        </div>
        <h2 className="mb-2 max-w-sm text-3xl font-bold leading-tight text-balance">
          Convierte tus metas en progreso diario.
        </h2>
        <p className="max-w-sm text-pretty text-white/80">
          Únete a miles de personas que organizan su vida y celebran cada
          pequeña victoria.
        </p>
      </div>

      <ul className="relative flex flex-col gap-4">
        {HIGHLIGHTS.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <item.icon className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-white/75">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
