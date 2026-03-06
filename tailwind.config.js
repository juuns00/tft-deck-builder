/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── 배경 ──────────────────────────────
        base:  "#060B14",
        panel: "#0A0F1A",
        card:  "#0D1828",

        // ── 보더 / 텍스트 ──────────────────────
        border: {
          DEFAULT: "#1E293B",
          subtle:  "#334155",
        },
        muted: "#475569",

        // ── TFT 코스트 색상 ────────────────────
        cost: {
          1: "#94A3B8",
          2: "#4ADE80",
          3: "#60A5FA",
          4: "#C084FC",
          5: "#FFD700",
          7: "#FF6B6B",
        },

        // ── 티어 색상 ──────────────────────────
        tier: {
          s: "#FFD700",
          a: "#C084FC",
          b: "#60A5FA",
          c: "#94A3B8",
        },

        // ── 증강 색상 ──────────────────────────
        aug: {
          prismatic: "#C084FC",
          gold:      "#FFD700",
          silver:    "#94A3B8",
        },

        // ── 점수 색상 ──────────────────────────
        score: {
          high:   "#4ADE80",
          mid:    "#FACC15",
          low:    "#FB923C",
          none:   "#94A3B8",
        },
      },

      fontFamily: {
        sans: ["'Noto Sans KR'", "'Apple SD Gothic Neo'", "'Malgun Gothic'", "sans-serif"],
      },

      borderRadius: {
        "2xl": "14px",
        "3xl": "18px",
      },

      boxShadow: {
        "cost-1": "0 0 10px #94A3B855",
        "cost-2": "0 0 10px #4ADE8055",
        "cost-3": "0 0 10px #60A5FA55",
        "cost-4": "0 0 10px #C084FC55",
        "cost-5": "0 0 10px #FFD70055",
        "gold":   "0 0 20px #FFD70009",
      },

      animation: {
        "fade-up": "fadeUp 0.25s ease both",
        "glow":    "glow 2s infinite",
      },

      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1"   },
        },
      },
    },
  },
  plugins: [],
};