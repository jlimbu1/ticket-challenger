import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        "gothic-black": "#0a0a0a",
        "parchment-white": "#e0d5c1",
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
        "gothic-serif": ["Playfair Display", "Georgia", "serif"],
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
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "skull-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-5px) rotate(-2deg)" },
          "75%": { transform: "translateY(-5px) rotate(2deg)" },
        },
        "rose-sway": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "distressed-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
        },
        "neon-pulse": {
          "0%, 100%": { textShadow: "0 0 7px rgba(255, 0, 68, 0.6), 0 0 10px rgba(255, 0, 68, 0.4)" },
          "50%": { textShadow: "0 0 14px rgba(255, 0, 68, 0.8), 0 0 20px rgba(255, 0, 68, 0.6)" },
        },
      },
      animation: {
        "vinyl-spin": "vinyl-spin 3s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "hover-glow": "hover-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "skull-float": "skull-float 4s ease-in-out infinite",
        "rose-sway": "rose-sway 3s ease-in-out infinite",
        "distressed-flicker": "distressed-flicker 0.15s infinite",
        "neon-pulse": "neon-pulse 1.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gothic-gradient": "linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)",
        "crimson-glow": "radial-gradient(circle, rgba(139,0,0,0.15) 0%, transparent 70%)",
        "purple-glow": "radial-gradient(circle, rgba(74,0,130,0.15) 0%, transparent 70%)",
        "distressed-texture": "repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
        "vinyl-texture": "repeating-radial-gradient(circle at 50% 50%, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
      },
      boxShadow: {
        "crimson-glow": "0 0 15px rgba(139, 0, 0, 0.3), 0 0 30px rgba(139, 0, 0, 0.1)",
        "purple-glow": "0 0 15px rgba(74, 0, 130, 0.3), 0 0 30px rgba(74, 0, 130, 0.1)",
        "neon-crimson": "0 0 7px rgba(255, 0, 68, 0.6), 0 0 10px rgba(255, 0, 68, 0.4)",
        "neon-purple": "0 0 7px rgba(176, 0, 255, 0.6), 0 0 10px rgba(176, 0, 255, 0.4)",
        "inner-glow": "inset 0 0 30px rgba(139, 0, 0, 0.1)",
      },
      borderRadius: {
        "vinyl": "50%",
      },
    },
  },
  plugins: [],
};