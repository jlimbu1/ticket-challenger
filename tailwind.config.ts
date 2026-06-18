export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        crimson: "#8B0000",
        deepPurple: "#4A0082",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin-slow 3s linear infinite",
        "hover-glow": "hover-glow 1.5s ease-in-out infinite",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "hover-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139, 0, 0, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(139, 0, 0, 0.8), 0 0 40px rgba(74, 0, 130, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};