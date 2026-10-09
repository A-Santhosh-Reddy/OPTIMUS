/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050814",
        surface: "#0c1328",
        "surface-card": "#0f1733",
        "surface-border": "rgba(56, 189, 248, 0.16)",
        "surface-hover": "#172347",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        cyber: {
          cyan: "#06b6d4",
          blue: "#38bdf8",
          indigo: "#6366f1",
          purple: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
        severity: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#f59e0b",
          low: "#38bdf8",
          info: "#64748b",
        }
      },
      boxShadow: {
        "liquid-cyan": "0 0 30px -5px rgba(6, 182, 212, 0.35)",
        "liquid-blue": "0 0 30px -5px rgba(56, 189, 248, 0.35)",
        "liquid-emerald": "0 0 30px -5px rgba(16, 185, 129, 0.35)",
        "liquid-red": "0 0 30px -5px rgba(239, 68, 68, 0.35)",
        "liquid-purple": "0 0 30px -5px rgba(168, 85, 247, 0.35)",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      }
    },
  },
  plugins: [],
};
