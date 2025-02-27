// src/components/blog-layout.tsx
import { motion } from 'framer-motion'
import { FiClock, FiCalendar, FiTag } from 'react-icons/fi'

interface BlogLayoutProps {
  title: string
  date: string
  tags?: string[] // 使标签可选
  readTime?: string
  children: React.ReactNode
}

export function BlogLayout({ 
  title, 
  date, 
  tags = [], // 添加默认空数组
  readTime, 
  children 
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen pt-24 px-4">
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* 文章头部 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <time>{date}</time>
            </div>
            {readTime && (
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
            )}
            {tags.length > 0 && ( // 只在有标签时显示标签部分
              <div className="flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                <div className="flex gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 文章目录 */}
        <div className="hidden xl:block fixed right-[calc(50%-48rem)] top-24 w-64">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
              目录
            </h3>
            <nav className="space-y-2 text-sm">
              {/* 这里可以添加目录内容 */}
            </nav>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="prose dark:prose-invert max-w-none prose-lg prose-blue prose-headings:scroll-mt-24 prose-a:no-underline hover:prose-a:underline prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
          {children}
        </div>

        {/* 文章底部 */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <a href="/blog" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline">
              ← 返回文章列表
            </a>
          </div>
        </div>
      </motion.article>
    </div>
  )
}