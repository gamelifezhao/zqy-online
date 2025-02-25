'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { name: '博客', href: '/blog' },
  { name: '关于我', href: '/about' },
  { name: 'Github', href: 'https://github.com' },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 导航栏 */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 right-0 p-8 z-50"
      >
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-full px-6 py-3 shadow-lg">
          <ul className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className="relative block px-4 py-2 text-base font-medium rounded-full
                    text-gray-700 dark:text-gray-200
                    transition-all duration-300 ease-out
                    hover:text-white dark:hover:text-white
                    group-hover:bg-gradient-to-r group-hover:from-[#FF0080] group-hover:via-[#7928CA] group-hover:to-[#4299E1]
                    group-hover:shadow-[0_0_2rem_-0.5rem_#7928CA]"
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.nav>

      {/* 主要内容 */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden shadow-xl"
          >
            <img
              src="/Ara.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#4299E1]">
            赵圻昀
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            一个关于技术的博客
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-8 text-gray-500 dark:text-gray-400 text-sm"
        >
          2022 赵圻昀. All rights reserved.
        </motion.div>
      </div>
    </main>
  )
}
