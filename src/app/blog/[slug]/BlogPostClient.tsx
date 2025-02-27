'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface BlogPostClientProps {
  mdxContent: any
  data: {
    title?: string
    [key: string]: any
  }
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
)

const LoadingContent = () => (
  <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
    <div className="animate-pulse space-y-8">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function BlogPostClient({ mdxContent, data }: BlogPostClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // 模拟内容加载完成
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // 初始加载动画
    const initialTimer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearTimeout(initialTimer)
    }
  }, [])

  if (isInitialLoading) {
    return <LoadingSpinner />
  }

  if (isLoading) {
    return <LoadingContent />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 px-4 max-w-4xl mx-auto"
    >
      <article className="prose dark:prose-invert max-w-none">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {data.title || '无标题'}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {mdxContent}
        </motion.div>
      </article>
    </motion.div>
  )
}
