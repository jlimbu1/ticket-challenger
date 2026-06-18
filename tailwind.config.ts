import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        crimson: "#8B0000",
        "crimson-hover": "#a00000",
        "crimson-light": "#cc3333",
        deepPurple: "#4A0082",
        "deepPurple-hover": "#5c00a0",
        "deepPurple-light": "#7b2dbf",
        neonCrimson: "#FF0044",
        neonPurple: "#B000FF",
        darkGray: "#1A1A1A",
        mediumGray: "#2A2A2A",
        lightGray: "#3A3A3A",
        offWhite: "#F5F5F5",
        "text-muted": "#888888",
        "border-default": "#222222",
        "border-light": "#333333",
        success: "#2d6a4f",
        warning: "#b8860b",
        error: "#8b0000",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        gothic: ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        "spin-slow": "spin-slow 3s linear infinite",
        "hover-glow": "hover-glow 1.5s ease-in-out infinite",
        "vinyl-spin": "vinyl-spin 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "hover-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139, 0, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(139, 0, 0, 0.6)" },
        },
        "vinyl-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
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
        "slide-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;