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
      backgroundImage: {
        distressed: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        "distressed-dark": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)",
        "grit": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "glow-red": "0 0 15px rgba(139, 0, 0, 0.3), 0 0 30px rgba(139, 0, 0, 0.1)",
        "glow-purple": "0 0 15px rgba(74, 0, 130, 0.3), 0 0 30px rgba(74, 0, 130, 0.1)",
        "inner-glow-red": "inset 0 0 15px rgba(139, 0, 0, 0.2)",
        "inner-glow-purple": "inset 0 0 15px rgba(74, 0, 130, 0.2)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139, 0, 0, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(139, 0, 0, 0.4)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;