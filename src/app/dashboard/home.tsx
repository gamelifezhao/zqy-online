"use client";
import React, { useState, useEffect } from "react";
import useThemeStore from "@/store/themeStore";
import useTypewriter from "react-typewriter-hook";
import { tong } from "./public/tong";
const Note = () => {
  const [randomInteger, setRandomInteger] = useState<any>("1");
  useEffect(() => {
    // 每 15 秒更新一次随机整数，范围是 1 到 117
    const intervalId = setInterval(() => {
      setRandomInteger(1 + Math.floor(Math.random() * 116)); // 生成 1 到 117 之间的随机整数
    }, 15000);

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []);
  const talk = useTypewriter(`${tong[randomInteger]}`);
  return <div className="text-primary text-xl subpixel-antialiased">{talk}</div>;
};
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
      <Note />
    </div>
  );
}

export default App;
