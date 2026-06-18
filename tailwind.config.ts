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
        "pulse-crimson": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "skull-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "distressed-flicker": {
          "0%, 100%": { opacity: "1" },
          "10%": { opacity: "0.8" },
          "20%": { opacity: "0.95" },
          "30%": { opacity: "0.85" },
          "40%": { opacity: "1" },
          "50%": { opacity: "0.9" },
          "60%": { opacity: "0.95" },
          "70%": { opacity: "0.85" },
          "80%": { opacity: "1" },
          "90%": { opacity: "0.9" },
        },
      },
      animation: {
        "vinyl-spin": "vinyl-spin 2s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "hover-glow": "hover-glow 2s ease-in-out infinite",
        "pulse-crimson": "pulse-crimson 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "skull-float": "skull-float 3s ease-in-out infinite",
        "distressed-flicker": "distressed-flicker 4s ease-in-out infinite",
      },
      backgroundImage: {
        "gothic-gradient": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        "crimson-gradient": "linear-gradient(135deg, #8B0000 0%, #4A0082 100%)",
        "dark-radial": "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)",
      },
      boxShadow: {
        "crimson-glow": "0 0 15px rgba(139, 0, 0, 0.4)",
        "purple-glow": "0 0 15px rgba(74, 0, 130, 0.4)",
        "neon-crimson": "0 0 10px rgba(255, 0, 68, 0.5), 0 0 20px rgba(255, 0, 68, 0.3)",
        "neon-purple": "0 0 10px rgba(176, 0, 255, 0.5), 0 0 20px rgba(176, 0, 255, 0.3)",
        "inner-dark": "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
      },
      letterSpacing: {
        "gothic-wide": "0.15em",
        "gothic-wider": "0.25em",
      },
    },
  },
  plugins: [],
};