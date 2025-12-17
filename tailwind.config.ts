import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#10B981',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
export default config;
