"use client";
import React from 'react';
import useThemeStore from '@/store/themeStore';

const ThemeSwitcher = () => {
  const { activeTheme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(activeTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-12 h-12 rounded-full 
        flex items-center justify-center
        transition-all duration-300
        ${activeTheme === 'light'
          ? 'bg-blue-50 text-yellow-500 hover:bg-blue-100'
          : 'bg-gray-800 text-blue-200 hover:bg-gray-700'}
      `}
      aria-label="Toggle theme"
    >
      {activeTheme === 'light' ? (
        // 太阳图标
        <svg
          className="w-6 h-6 transform transition-transform hover:rotate-90 duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // 月亮图标
        <svg
          className="w-6 h-6 transform transition-transform hover:scale-110 duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitcher;
