'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function FilterBar<T extends string>({
  filters,
  value,
  onChange,
  onDrop,
  dropTargets,
}: {
  filters: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
  onDrop?: (filter: T) => void
  dropTargets?: Set<T>
}) {
  const [dragOver, setDragOver] = useState<T | null>(null)

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isAccepted = dropTargets?.has(f.value) ?? false
        const isDragOverTarget = dragOver === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            onDragOver={(e) => {
              if (!isAccepted) return
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              setDragOver(f.value)
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              if (!isAccepted) return
              e.preventDefault()
              setDragOver(null)
              onDrop?.(f.value)
            }}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              value === f.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
              isAccepted && !isDragOverTarget && 'border-2 border-dashed border-border',
              isDragOverTarget && 'border-2 border-primary bg-primary/10 text-primary scale-105 shadow-lg',
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
