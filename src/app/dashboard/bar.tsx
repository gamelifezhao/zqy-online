"use client";
import useThemeStore from "@/store/themeStore";
// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { activeTheme } = useThemeStore((state) => state);
  return (
    <div
      className={`theme-${activeTheme} text-primary h-8 px-20 bg-backgroundBar`}
    >
      zhaoqiyun
    </div>
  );
};
