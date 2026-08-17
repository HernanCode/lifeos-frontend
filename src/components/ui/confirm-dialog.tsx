'use client'

import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Eliminar',
  onConfirm,
  variant = 'danger',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
  variant?: 'danger' | 'warning'
}) {
  async function handleConfirm() {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-foreground/10 outline-none transition-[scale,opacity] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0',
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                'flex size-12 items-center justify-center rounded-2xl',
                variant === 'danger'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-amber-500/10 text-amber-500',
              )}
            >
              <AlertTriangle className="size-6" />
            </div>
            <Dialog.Title className="mt-3 font-display text-lg font-extrabold tracking-tight">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-1.5 text-sm text-muted-foreground">
              {description}
            </Dialog.Description>
          </div>

          <div className="flex gap-3">
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                />
              }
            >
              Cancelar
            </Dialog.Close>
            <Button
              type="button"
              variant={variant === 'danger' ? 'destructive' : 'default'}
              className="flex-1"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
