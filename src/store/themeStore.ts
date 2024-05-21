// store/themeStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type theme = "nord" | "solarizedLight";

type themeStore = {
    themes: theme[];
    activeTheme: theme;
    setTheme: (theme: theme) => void;
};

const useThemeStore = create<themeStore>()(
    // 持久化中间件
    persist(
        (set) => ({
            themes: [ "nord", "solarizedLight"],
            activeTheme: "nord",
            setTheme: (activeTheme: theme) => set(() => ({ activeTheme })),
        }),
        {
            name: "active-theme", // 存储在storage中的key名
            // storage: createJSONStorage(() => sessionStorage), // 存储数据库配置，默认使用localstorage
            // 过滤函数
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => key === "activeTheme")
                ),
        }
    )
);

export default useThemeStore;
