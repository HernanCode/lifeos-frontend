'use client'

import { useSyncExternalStore } from 'react'
import useAuthStore from '@/store/authStore'
import type { User } from '@/types'

export function firstName(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts[0] ?? 'ahí'
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export function useCurrentUser(): User | null {
  return useSyncExternalStore(
    useAuthStore.subscribe,
    () => useAuthStore.getState().user,
    () => null,
  )
}
