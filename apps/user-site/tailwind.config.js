/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bauhaus: {
          canvas: "var(--bg-canvas)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          ink: "var(--text-ink)",
          muted: "var(--text-muted)",
          border: "var(--border-base)",
          red: "var(--accent-red)",
          blue: "var(--accent-blue)",
          yellow: "var(--accent-yellow)"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px'
      },
      boxShadow: {
        bauhaus: '4px 4px 0px var(--border-base)',
        'bauhaus-lg': '6px 6px 0px var(--border-base)',
        'bauhaus-red': '4px 4px 0px var(--accent-red)',
        'bauhaus-yellow': '4px 4px 0px var(--accent-yellow)',
        'bauhaus-blue': '4px 4px 0px var(--accent-blue)',
      }
    },
  },
  plugins: [],
}
