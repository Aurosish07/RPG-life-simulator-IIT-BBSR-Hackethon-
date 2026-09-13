import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fantasy theme colors
        fantasy: {
          bg: '#1a1625',
          surface: '#241e35',
          primary: '#c084fc',
          secondary: '#a855f7',
          accent: '#f0abfc',
          text: '#f5f0ff',
          textMuted: '#c4b8e8',
          border: '#3d305c',
          gold: '#fbbf24',
          goldLight: '#fde68a',
        },
        // Cyberpunk theme colors
        cyberpunk: {
          bg: '#0a0a0f',
          surface: '#14141f',
          primary: '#00ff9d',
          secondary: '#ff006e',
          accent: '#00ffff',
          text: '#e0ffe8',
          textMuted: '#8affc8',
          border: '#00ff9d40',
          gold: '#ffd700',
          goldLight: '#ffe066',
        },
        // Lo-fi theme colors
        lofi: {
          bg: '#fdf8f3',
          surface: '#fff5ec',
          primary: '#d4a373',
          secondary: '#c9966a',
          accent: '#e8c5a0',
          text: '#4a3f35',
          textMuted: '#8d7b6b',
          border: '#e8d5c4',
          gold: '#c4963a',
          goldLight: '#e8c56d',
        },
        // Default theme (minimal)
        default: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#a5b4fc',
          text: '#ffffff',
          textMuted: '#a1a1aa',
          border: '#27272a',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
        },
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        cyberpunk: ['Orbitron', 'sans-serif'],
        lofi: ['Nunito', 'sans-serif'],
        default: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'Orbitron', 'Nunito', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'level-up': 'levelUp 1.5s ease-out forwards',
        'xp-gain': 'xpGain 1s ease-out forwards',
        'coin-flip': 'coinFlip 0.6s ease-out forwards',
        'checkmark': 'checkmark 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(192, 132, 252, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(192, 132, 252, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        xpGain: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-30px) scale(1.5)', opacity: '0' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        checkmark: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    },
  },
  plugins: [],
}
export default config