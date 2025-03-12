// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'
import ThemeBackground from '@/components/theme-background'
import NavigationWrapper from '@/components/NavigationWrapper'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen relative">
            <ThemeBackground />
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}