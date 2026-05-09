/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: { DEFAULT: "#0D0D0D", 50: "#F5F5F3", 100: "#E8E8E3", 200: "#C8C8BE", 300: "#A0A090", 400: "#707060", 500: "#4A4A3A", 600: "#2E2E22", 700: "#1C1C14", 800: "#121210", 900: "#0D0D0D" },
        acid: { DEFAULT: "#C8F135", light: "#D9F96A", dark: "#9ABF1A" },
        ember: { DEFAULT: "#FF4D1C", light: "#FF7A50", dark: "#CC3410" },
        sky: { DEFAULT: "#0EA5E9", light: "#38BDF8", dark: "#0284C7" },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-right": "slideRight 0.5s ease forwards",
        "count-up": "countUp 1s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideRight: { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        countUp: { from: { opacity: "0", transform: "scale(0.8)" }, to: { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
}