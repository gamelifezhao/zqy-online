// components/Nav.tsx
'use client'

import { useTheme } from '@/components/theme-provider'
import Link from 'next/link'
import { motion } from 'framer-motion'

const navItems = [
  { name: '首页', href: '/' },
  { name: '记录', href: '/blog' },
  { name: '关于我', href: '/about' },
]

export const Nav = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50"
    >
      <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-full px-4 py-2 shadow-lg border border-gray-200/20 dark:border-white/10">
        <ul className="flex items-center space-x-1">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className="relative block px-3 py-1.5 text-sm font-medium rounded-full
                  text-gray-700 dark:text-gray-200
                  transition-all duration-300 ease-out
                  group-hover:text-white"
              >
                <motion.span
                  className="relative z-10 block"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.name}
                </motion.span>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#4299E1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </Link>
            </motion.li>
          ))}

          <motion.div className="h-4 w-[1px] bg-gray-300/30 dark:bg-white/20 mx-2" />

          <motion.li className="relative group">
            <motion.button
              onClick={() => toggleTheme()}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
              className="relative block px-3 py-1.5 rounded-full
                text-gray-700 dark:text-gray-200
                transition-all duration-300 ease-out
                group-hover:text-white"
            >
              <motion.span
                className="relative z-10 block"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-4 h-4" />
                ) : (
                  <SunIcon className="w-4 h-4" />
                )}
              </motion.span>
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#4299E1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.button>
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  )
}

// 图标组件保持不变
const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={`text-gray-700 dark:text-gray-200 transition-colors ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
)

const SunIcon = ({ className }: { className?: string }) => (
  <motion.svg
    className={`text-gray-700 dark:text-gray-200 transition-colors ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </motion.svg>
)