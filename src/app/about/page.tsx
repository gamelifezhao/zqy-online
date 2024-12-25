"use client";
import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-16">
      {/* Profile Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Image
                src="/Ara.jpg"
                alt="昀的头像"
                fill
                className="rounded-full object-cover border-4 border-text-primary/20 hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 drop-shadow-[0_0_0.3rem_var(--text-primary)]">
              昀
            </h1>
            <p className="text-text-secondary text-lg mb-8">
              一个热爱编程和开源的开发者
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4 drop-shadow-[0_0_0.3rem_var(--text-primary)]">
                关于我
              </h2>
              <p className="text-text-secondary leading-relaxed">
                你好！我是昀，一个热爱探索和创造的开发者。
                我喜欢尝试新技术，同时也乐于分享我的知识和经验。
              </p>
            </section>

            {/* Skills Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 drop-shadow-[0_0_0.3rem_var(--text-primary)]">
                技能
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'JavaScript/TypeScript',
                  'React/Next.js',
                  'Node.js',
                  'Python',
                  'Git',
                  'Figma',
                ].map((skill) => (
                  <div
                    key={skill}
                    className="p-4 rounded-lg bg-background-secondary text-text-primary text-center
                    hover:drop-shadow-[0_0_0.3rem_var(--text-primary)] transition-all duration-300"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 drop-shadow-[0_0_0.3rem_var(--text-primary)]">
                项目展示
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-background-secondary hover:drop-shadow-[0_0_0.3rem_var(--text-primary)] transition-all duration-300">
                  <h3 className="text-xl font-medium mb-2">个人博客</h3>
                  <p className="text-text-secondary mb-4">
                    使用 Next.js 和 TailwindCSS 构建的现代博客，支持深色模式和响应式设计。
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-background text-text-secondary">
                      Next.js
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-background text-text-secondary">
                      TailwindCSS
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-background-secondary hover:drop-shadow-[0_0_0.3rem_var(--text-primary)] transition-all duration-300">
                  <h3 className="text-xl font-medium mb-2">项目管理系统</h3>
                  <p className="text-text-secondary mb-4">
                    一个全栈项目管理应用，支持实时更新和任务管理。
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-background text-text-secondary">
                      React
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-background text-text-secondary">
                      Node.js
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 drop-shadow-[0_0_0.3rem_var(--text-primary)]">
                联系我
              </h2>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/argvchs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                    />
                  </svg>
                </a>
                <a
                  href="mailto:argvchs@gmail.com"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage