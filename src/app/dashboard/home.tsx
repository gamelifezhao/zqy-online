"use client";
import React, { useState, useEffect } from "react";
import useThemeStore from "@/store/themeStore";
import useTypewriter from "react-typewriter-hook";
import { useRequest } from "ahooks";
import { tong } from "./public/tong";
const Note = () => {
  const [data, setData] = useState<any>({ hitokoto: "" });
  const getHitokoto = async () => {
    const res: any = await fetch("https://v1.hitokoto.cn/?c=a&c=k&c=i&c=f", {
      method: "GET",
    });
    res.json().then((res: any) => {
      console.log("🚀 ~ res.json.then ~ res:", res);
      setData(res);
    });
  };

  const { run } = useRequest(getHitokoto, {
    pollingInterval: 10000,
    pollingWhenHidden: false,
    manual: true,
  });
  useEffect(() => {
    run();
  }, [run]);
  const talk = useTypewriter(data.hitokoto);
  return (
    <div className="text-primary text-xl subpixel-antialiased w-1/2 mt-52 flex flex-col items-center">
      {talk}
    </div>
  );
};
function App() {
  const { themes, activeTheme, setTheme } = useThemeStore((state) => state);

  return (
    <div
      className={`
        theme-${activeTheme}
        bg-background
        px-20
        h-full-minus-75px
        flex flex-col items-center
      `}
    >
      <Note />
    </div>
  );
}

export default App;
