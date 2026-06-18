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
        body: ["Cormorant Garamond", "Georgia", "serif"],
        gothic: ["Playfair Display", "Georgia", "serif"],
      },
      keyframes: {
        "vinyl-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "hover-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139, 0, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(139, 0, 0, 0.6)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "distressed-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
        },
      },
      animation: {
        "vinyl-spin": "vinyl-spin 2s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "hover-glow": "hover-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "distressed-flicker": "distressed-flicker 0.15s ease-in-out infinite",
      },
      backgroundImage: {
        "distressed": "repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px)",
        "distressed-dark": "repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0, 0, 0, 0.05) 1px, rgba(0, 0, 0, 0.05) 2px)",
        "grit": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "crimson-glow": "0 0 10px rgba(139, 0, 0, 0.4), 0 0 20px rgba(139, 0, 0, 0.2)",
        "purple-glow": "0 0 10px rgba(74, 0, 130, 0.4), 0 0 20px rgba(74, 0, 130, 0.2)",
        "neon-crimson": "0 0 5px rgba(255, 0, 68, 0.5), 0 0 10px rgba(255, 0, 68, 0.3)",
        "neon-purple": "0 0 5px rgba(176, 0, 255, 0.5), 0 0 10px rgba(176, 0, 255, 0.3)",
        "inner-glow": "inset 0 0 30px rgba(0, 0, 0, 0.5)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
    },
  },
  plugins: [],
};