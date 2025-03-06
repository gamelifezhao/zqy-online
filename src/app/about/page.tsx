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
    period: '2023 - 现在',
    title: '前端开发工程师',
    company: '宝尊电商',
    description: '主导DBA运维管理平台前端架构设计与核心功能开发，主要贡献包括：\n- 采用React+TypeScript技术栈实现数据库监控/慢查询分析/容量预测等核心模块\n- 设计可视化数据看板体系，通过ECharts实现TB级运维数据的实时可视化呈现\n- 开发智能诊断功能，结合运维知识图谱提供自动化故障排查建议\n- 主导前端性能优化，将首屏加载时间从8s降至1.2s(Lighthouse评分提升至92)\n- 设计并实现动态表单引擎，支持快速配置化生成数据库运维工单系统\n- 推动前端工程化建设，建立CI/CD流水线实现构建部署效率提升300%'
  },
  {
    period: '2021.4 - 2022.6',
    title: '前端开发工程师',
    company: '博彦科技（腾讯PCG业务）',
    description: '负责大事件管理系统（PC端）的前端开发，团队规模：前端2人，后端4人，运维1人\n- 使用React + Redux + React-Redux + Redux-Thunk + UMI + Ant Design + DVA + TS技术栈\n- 开发大事件管理系统用于腾讯视频与腾讯体育大事件QPS的检测并实时调整QPS，以及查看每大事件具体信息的中台功能一体化系统\n- 负责QPS集群前端展示，每个大事件实时监控QPS走向，针对QPS的缓容以及容灾\n- 由于业务数据量大所以对前端表格可视化要求较高，引入Echarts的同时再次基础上进行了二次封装，使用户可以自由选择图表数据展示格式，引入Ahooks对组内自定义hooks功能相似可替代的进行替换\n- 对整体业务进度的把控，编写技术文档，进行技术调研'
  },
  {
    period: '2019.5 - 2021.4',
    title: '前端开发工程师',
    company: '一商捷网络科技',
    description: '负责推荐星球（PC端）项目的前端开发工作，一款主打社交引导用户做任务获取佣金的网站\n- 使用React + Redux + React-Redux + Redux-Thunk + UMI + Ant Design + DVA技术栈\n- 开发论坛模块，实现用户看帖、刷帖、发帖等核心功能\n- 解决帖子数据量过大导致首屏加载慢问题，引入react-window实现列表虚拟加载，优化自适应布局\n- 设计并实现敏感词过滤系统，采用DFA算法构造高效数据结构，实现内容审核\n- 借鉴知乎等平台的UI/UE设计，优化用户交互体验，同时保留代码可扩展性避免后期大面积重构'
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
        <h2 className="text-2xl font-bold mb-10 text-gray-800 dark:text-gray-100 flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">工作经历</span>
          <div className="h-[1px] flex-grow ml-4 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
        </h2>
        
        <div className="relative before:absolute before:inset-0 before:left-[17px] md:before:left-1/2 before:-ml-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-pink-500 before:to-blue-500 before:opacity-20">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative flex items-center justify-between md:justify-normal mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 ml-[7px] md:-ml-[10px] bg-gradient-to-r from-purple-600 to-pink-600 w-[20px] h-[20px] rounded-full shadow-glow z-10 border-2 border-white dark:border-gray-900"></div>
              
              {/* Content card */}
              <motion.div 
                className={`relative ml-10 md:ml-0 md:max-w-[calc(50%-40px)] w-full bg-white/5 backdrop-blur-sm border border-gray-200/10 dark:border-white/10 p-6 rounded-xl shadow-md hover:shadow-lg hover:border-purple-500/30 transition-all duration-300 ${index % 2 === 0 ? 'md:mr-[40px]' : 'md:ml-[40px]'}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {exp.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-lg font-medium text-purple-600 dark:text-purple-400">{exp.company}</span>
                    </div>
                  </div>
                  <span className="mt-2 md:mt-0 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {exp.period}
                  </span>
                </div>
                
                <div className="text-gray-600 dark:text-gray-300 mt-3 prose dark:prose-invert max-w-none text-sm">
                  {exp.description.split('\n').map((item, i) => {
                    if (item.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start mt-2">
                          <div className="min-w-[8px] h-[8px] rounded-full bg-purple-500 mt-1.5 mr-2"></div>
                          <p className="m-0">{item.substring(2)}</p>
                        </div>
                      )
                    }
                    return <p key={i} className="mb-2">{item}</p>
                  })}
                </div>
              </motion.div>
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