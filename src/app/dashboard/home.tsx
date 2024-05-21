"use client";
import React from "react";
import useThemeStore from "@/store/themeStore";
function App() {
  const { themes, activeTheme, setTheme } = useThemeStore((state) => state);

  return (
    <div
      className={`
        theme-${activeTheme}
        bg-background
        w-100 h-92 px-20
        flex flex-col justify-center items-center
      `}
    >
      <p className="mb-10 text-primary">当前主题：{activeTheme}</p>
      <span className="text-primary/[0.5]">点击下方按钮切换主题</span>
      <div className="mt-10">
        {themes.map((theme, index) => (
          <button
            key={theme}
            className="border rounded p-2 mr-5 bg-secondary text-white"
            onClick={() => setTheme(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
