import type { LucideIcon } from 'lucide-react'
import {
  Bot,
  Flag,
  LayoutDashboard,
  ListChecks,
  Repeat,
  Settings,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/goals', label: 'Metas', icon: Flag },
  { href: '/tasks', label: 'Tareas', icon: ListChecks },
  { href: '/habits', label: 'Hábitos', icon: Repeat },
  { href: '/assistant', label: 'IA', icon: Bot },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export type Accent = 'blue' | 'purple' | 'green' | 'orange' | 'pink'

export const ACCENT_CLASSES: Record<
  Accent,
  { text: string; bar: string; soft: string; ring: string; solid: string }
> = {
  blue: {
    text: 'text-brand-blue',
    bar: 'bg-brand-blue',
    soft: 'bg-brand-blue-soft',
    ring: 'ring-brand-blue/20',
    solid: 'bg-brand-blue text-white',
  },
  purple: {
    text: 'text-brand-purple',
    bar: 'bg-brand-purple',
    soft: 'bg-brand-purple-soft',
    ring: 'ring-brand-purple/20',
    solid: 'bg-brand-purple text-white',
  },
  green: {
    text: 'text-brand-green',
    bar: 'bg-brand-green',
    soft: 'bg-brand-green-soft',
    ring: 'ring-brand-green/20',
    solid: 'bg-brand-green text-white',
  },
  orange: {
    text: 'text-brand-orange',
    bar: 'bg-brand-orange',
    soft: 'bg-brand-orange-soft',
    ring: 'ring-brand-orange/20',
    solid: 'bg-brand-orange text-white',
  },
  pink: {
    text: 'text-brand-pink',
    bar: 'bg-brand-pink',
    soft: 'bg-brand-pink-soft',
    ring: 'ring-brand-pink/20',
    solid: 'bg-brand-pink text-white',
  },
}
