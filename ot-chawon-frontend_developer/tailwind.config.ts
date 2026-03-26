import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "oc-black": "#111111",
        "oc-accent": "#FF6B35",
        "oc-gray": {
          50: "#F9F9F9",
          200: "#E5E5E5",
          500: "#9E9E9E",
          800: "#333333",
        },
      },
    },
  },
  plugins: [],
};
export default config;
