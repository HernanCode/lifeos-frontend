'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-2xl font-extrabold tracking-tight">
        Algo salió mal
      </p>
      <p className="text-muted-foreground">
        Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
