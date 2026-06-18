import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gothic: {
          black: "#000000",
          "black-secondary": "#0a0a0a",
          "black-tertiary": "#111111",
          red: "#8B0000",
          "red-light": "#a00000",
          "red-dark": "#6b0000",
          purple: "#4A0082",
          "purple-light": "#5c00a3",
          "purple-dark": "#380063",
          text: "#e0dcd0",
          "text-muted": "#8a8578",
          "text-dim": "#5a5548",
          border: "#1a1a1a",
          "border-light": "#2a2a2a",
          success: "#2d6a2d",
          warning: "#8b6f00",
          error: "#8b0000",
          overlay: "rgba(0, 0, 0, 0.8)",
          "glow-red": "rgba(139, 0, 0, 0.3)",
          "glow-purple": "rgba(74, 0, 130, 0.3)",
        },
      },
      fontFamily: {
        gothic: ["UnifrakturCook", "serif"],
        heading: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        body: ["Crimson Text", "Georgia", "Times New Roman", "serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      zIndex: {
        base: "1",
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
      },
      keyframes: {
        spinVinyl: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139, 0, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(139, 0, 0, 0.6)" },
        },
      },
      animation: {
        "spin-vinyl": "spinVinyl 2s linear infinite",
        "fade-in": "fadeIn 300ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
        "slide-out-right": "slideOutRight 300ms ease-in",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;