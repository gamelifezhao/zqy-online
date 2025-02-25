import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '赵圻昀的博客',
  description: '一个关于技术的博客',
  other: {
    'bfcache': 'back-forward-cache'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen relative">
          <div className="absolute inset-0 bg-[#f8f9fa] dark:bg-[#0d1117]" />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0080] via-[#7928CA] to-[#4299E1] opacity-[0.07] dark:opacity-[0.15]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </div>
          <div className="relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
