"use client";
import React from "react";
import DayNightScene from "@/components/three/DayNightScene";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative">
      <DayNightScene />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-6xl font-bold tracking-tight drop-shadow-[0_0_0.3rem_var(--text-primary)]">
            昀 の小窝
          </h1>
          <p className="text-xl text-text-secondary">
            欢迎来到我的个人空间 👋
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/argvchs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full bg-background-secondary text-text-primary
                hover:drop-shadow-[0_0_0.3rem_var(--text-primary)] transition-all duration-300"
            >
              GitHub
            </a>
            <a
              href="/about"
              className="px-6 py-2 rounded-full bg-background-secondary text-text-primary
                hover:drop-shadow-[0_0_0.3rem_var(--text-primary)] transition-all duration-300"
            >
              了解更多
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
