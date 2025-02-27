import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        separator: "rgb(var(--color-separator) / <alpha-value>)",
        backgroundBar: "rgb(var(--color-separator) / <alpha-value>)",
      },
      textColor: {
        primary: "rgb(var(--color-foreground) / <alpha-value>)",
      },
    },
    height: {
      'full-minus-75px': 'calc(100vh - 75px)',
    }
  },
  plugins: [],
  darkMode: "class",
};
export default config;
