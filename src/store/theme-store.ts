import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Accent } from '@/lib/app-data'

type ThemeState = {
  accent: Accent
  darkMode: boolean
  setAccent: (accent: Accent) => void
  toggleDarkMode: () => void
  setDarkMode: (dark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accent: 'purple',
      darkMode: false,
      setAccent: (accent) => set({ accent }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: 'theme-storage',
    },
  ),
)
