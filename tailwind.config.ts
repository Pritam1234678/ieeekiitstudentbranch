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
        navy: {
          DEFAULT: "#0A1A2F",
          50: "#E6EBF1",
          100: "#0F1F35",
        },
        royal: {
          DEFAULT: "#0B5ED7",
          50: "#E6F0FF",
          100: "#0952C2",
        },
        sky: {
          DEFAULT: "#E6F0FF",
          50: "#F5F9FF",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(120deg, #0A1A2F 0%, #0B5ED7 100%)",
        "subtle-gradient": "linear-gradient(180deg, #FFFFFF 0%, #E6F0FF 100%)",
        "section-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(230, 240, 255, 0.95) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.02em",
        wider: "0.04em",
        widest: "0.08em",
      },
      lineHeight: {
        tight: "1.1",
        snug: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
      animation: {
        "fade-in": "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      spacing: {
        section: "8rem",
        "section-sm": "4rem",
      },
    },
  },
  plugins: [],
};

export default config;
