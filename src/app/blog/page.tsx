'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiClock, FiTag } from 'react-icons/fi'

const blogPosts = [
  {
    id: 'git20230321',
    title: 'git提交commit规范',
    description: 'git提交commit规范',
    date: '2023-03-21',
    tags: ['git', '随笔'],
    readTime: '20 min'
  },
  {
    id: 'network-protocol',
    title: '深入理解网络协议：从TCP/IP到HTTP',
    description: '本文详细介绍了网络协议的基础知识，包括TCP/IP协议族、HTTP协议的工作原理等核心概念。',
    date: '2022-02-27',
    tags: ['网络', 'TCP/IP', 'HTTP'],
    readTime: '15 min'
  },
  {
    id: 'react20220908',
    title: '读卡颂《react技术揭秘》随笔o.O!',
    description: '读卡颂的react技术揭秘一写自己的见解以及学习到了什么。',
    date: '2022-09-08',
    tags: ['react', '卡颂', '随笔'],
    readTime: '10 min'
  }
  // 可以添加更多博客文章
]

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          技术博客
        </h1>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-purple-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4" />
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <time className="text-sm">{post.date}</time>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  )
}