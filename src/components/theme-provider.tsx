'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const accent = useThemeStore((s) => s.accent)
  const darkMode = useThemeStore((s) => s.darkMode)

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(darkMode ? 'dark' : 'light')

    root.setAttribute('data-accent', accent)
  }, [accent, darkMode])

  return <>{children}</>
}
