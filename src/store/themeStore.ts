// store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type theme = "light" | "dark";

type themeStore = {
    activeTheme: theme;
    setTheme: (theme: theme) => void;
};

const useThemeStore = create<themeStore>()(
    persist(
        (set) => ({
            activeTheme: "light",
            setTheme: (activeTheme: theme) => set({ activeTheme }),
        }),
        {
            name: "theme-store",
        }
    )
);

export default useThemeStore;
