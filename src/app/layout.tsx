import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/app/providers'
import { ThemeProvider } from '@/components/theme-provider'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Momentum — Tu compañero diario de productividad',
  description:
    'Momentum te ayuda a seguir metas, tareas y hábitos con un panel de control amigable y motivador que querrás abrir cada día.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7c3aed',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`light ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="bg-background font-sans antialiased">
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
