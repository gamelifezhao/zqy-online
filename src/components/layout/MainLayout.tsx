"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '../ThemeSwitcher';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`
          relative px-2 py-1
          text-text-primary transition-all duration-300
          ${isActive 
            ? 'font-medium drop-shadow-[0_0_0.3rem_var(--text-primary)]' 
            : 'text-text-secondary hover:text-text-primary hover:drop-shadow-[0_0_0.3rem_var(--text-primary)]'}
        `}
      >
        {children}
        {isActive && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-text-primary transform origin-left transition-transform"></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪐</span>
            <span className="text-xl font-medium text-text-primary drop-shadow-[0_0_0.3rem_var(--text-primary)]">
              昀 の小窝
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/about">关于</NavLink>
            <NavLink href="/archives">归档</NavLink>
            <NavLink href="/categories">分类</NavLink>
            <NavLink href="/tags">标签</NavLink>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>

      <main className="pt-16 container mx-auto px-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
