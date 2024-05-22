"use client";
import React from "react";
import useThemeStore from "@/store/themeStore";
import Lottie from "react-lottie";
import titlePng from "./public/星球.json";
import Image from "next/image";
// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { activeTheme, setTheme } = useThemeStore((state) => state);
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
      className={`theme-${activeTheme} text-white px-20 bg-backgroundBar flex justify-between `}
      style={{ height: "75px" }}
    >
      <div style={{ lineHeight: "75px" }}>
        <Lottie
          options={defaultOptions}
          width={80}
          height={80}
          isClickToPauseDisabled={true}
        />
      </div>
      <div
        className="font-serif text-2xl font-semibold flex  justify-between w-auto items-center"
        style={{ lineHeight: "75px" }}
      >
        <div className="cursor-pointer mr-5">实验室</div>
        <div className="cursor-pointer  mr-5">想法</div>
        <div className="cursor-pointer  mr-5">人间纪实</div>
        <div
          className={`w-20 h-10  border-solid border-2 rounded-lg border-indigo-900 flex justify-between bg-secondary truncate`}
        >
          <div
            className={`cursor-pointer   p-1  ${
              activeTheme === "solarizedLight"
                ? "bg-sky-500 rounded-lg border-solid"
                : ""
            }`}
            onClick={() => setTheme("solarizedLight")}
          >
            <Image
              src={
                activeTheme === "solarizedLight"
                  ? "/bright2.svg"
                  : "/bright1.svg"
              }
              alt="黑色未选中"
              width={27}
              height={27}
            />
          </div>
          {/* <div
            style={{ height: "100%", width: "2px" }}
            className="bg-backgroundBar "
          /> */}
          <div
            className={`cursor-pointer   p-1  ${
              activeTheme === "nord"
                ? "bg-neutral-700  rounded-s-lg border-solid"
                : ""
            }`}
            onClick={() => setTheme("nord")}
          >
            <Image
              src={activeTheme === "nord" ? "/dark2.svg" : "/dark1.svg"}
              alt="黑色未选中"
              width={27}
              height={27}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
