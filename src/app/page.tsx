'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen">
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
