export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  )
}
