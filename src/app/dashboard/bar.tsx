"use client";
import React from "react";
import useThemeStore from "@/store/themeStore";
import Lottie from "react-lottie";
import titlePng from './public/星球.json'
// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { activeTheme } = useThemeStore((state) => state);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: titlePng, // 动画JSON文件路径
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className={`theme-${activeTheme} text-primary h-8 px-20 bg-backgroundBar flex flex-col justify-center items-center`}
    >
      <div>
        <Lottie
          options={defaultOptions}
          width={100}
          height={100}
          isClickToPauseDisabled={true}
        />
      </div>
    </div>
  );
};
