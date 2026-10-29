/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#020617", // deep navy/slate-950
          dark: "#0f172a",    // slate-900
          card: "#1e293b",    // slate-800
          border: "#334155",  // slate-700
          accent: "#3b82f6",  // professional blue
          accentHover: "#2563eb",
          cyanAI: "#06b6d4"   // cyan AI highlights
        },
        security: {
          genuine: "#10b981", // green-500
          fraud: "#ef4444"    // red-500
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
