// src/app/about/page.tsx
'use client'

import { motion } from 'framer-motion'
import { SiReact, SiTypescript, SiNodedotjs, SiNextdotjs, SiTailwindcss, SiGit, SiDocker, SiJenkins } from 'react-icons/si'
import { HiOutlineMail } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'

const skills = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'jinkens', icon: SiJenkins, color: '#4479A1' },
]

const experiences = [
  {
    period: '2020 - 现在',
    title: '高级前端开发工程师',
    company: '某科技公司',
    description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。'
  },
  // 可以添加更多经历
]

export default function About() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      {/* 个人简介部分 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mb-16"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl ring-2 ring-purple-500/20"
          >
            <img
              src="/Ara.jpg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              赵圻昀
            </h1>
            <p className="text-xl text-purple-600 dark:text-purple-400 mb-6">
              前端开发工程师
            </p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                你好！我是赵圻昀，一名充满热情的前端开发工程师。我热爱创造优美的用户界面和流畅的用户体验。
                在过去的几年里，我专注于现代Web中台应用开发，对于中台的UI设计和业务框架流程有丰富的经验,
                以及其他Toc应用也有一定实践涉猎。
              </p>
            </div>  
          </div>
        </div>
      </motion.section>

      {/* 技能部分 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          技术栈
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group relative flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <skill.icon 
                className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110" 
                style={{ color: skill.color }}
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 工作经历部分 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          工作经历
        </h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:to-pink-500"
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
                {exp.period}
              </span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {exp.title}
              </h3>
              <p className="text-purple-600 dark:text-purple-400 mt-1">
                {exp.company}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 联系方式部分 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          联系方式
        </h2>
        <div className="flex flex-wrap gap-6">
          <a
            href="mailto:gamelifezhao@163.com"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <HiOutlineMail className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700 dark:text-gray-300">gamelifezhao@163.com</span>
          </a>
          <a
            href="https://github.com/gamelifezhao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <FaGithub className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700 dark:text-gray-300">灰色大仙</span>
          </a>
        </div>
      </motion.section>
    </div>
  )
}