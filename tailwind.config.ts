import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Microsoft / Fluent-inspired palette (mirrors the Academy workbook)
        ink: "#14131a",
        paper: "#eef1f6",
        navy: {
          900: "#071b3a",
          800: "#0a2f63",
          700: "#0d47a1",
        },
        azure: {
          DEFAULT: "#0a6ed1",
          deep: "#0a4f9e",
          bright: "#3aa0ff",
        },
        gold: "#ffc21e",
        ship: "#e8590c",
        grass: "#0e8a0e",
        grape: "#6b2fb3",
        line: "#e2e0e8",
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["Cascadia Code", "Consolas", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,26,54,.06), 0 2px 8px rgba(16,26,54,.06)",
        pop: "0 8px 24px rgba(16,26,54,.12), 0 24px 48px rgba(16,26,54,.08)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
