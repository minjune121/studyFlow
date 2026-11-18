import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#cbdbf5',
          bright: '#f8f9ff',
          lowest: '#ffffff',
          low: '#eff4ff',
          container: '#e5edff',
          high: '#dbe7ff',
          highest: '#cbdbf5',
        },
        'on-surface': {
          DEFAULT: '#0d1b2a',
          variant: '#414754',
        },
        outline: {
          DEFAULT: '#727785',
          variant: '#c2c7d6',
        },
        primary: {
          DEFAULT: '#4f46e5',
          container: '#e0e7ff',
          'on-container': '#3730a3',
        },
        'on-primary': '#ffffff',
        secondary: {
          DEFAULT: '#6366f1',
          container: '#eef2ff',
          'on-container': '#312e81',
        },
        'on-secondary': '#ffffff',
        tertiary: {
          DEFAULT: '#0284c7',
          container: '#e0f2fe',
          'on-container': '#0369a1',
        },
        'on-tertiary': '#ffffff',
        error: {
          DEFAULT: '#ef4444',
          container: '#fee2e2',
          'on-container': '#b91c1c',
        },
        'on-error': '#ffffff',
        warning: {
          DEFAULT: '#f59e0b',
          container: '#fef3c7',
          'on-container': '#b45309',
        },
        'on-warning': '#ffffff',
        success: {
          DEFAULT: '#10b981',
          container: '#d1fae5',
          'on-container': '#047857',
        },
        'on-success': '#ffffff',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        popover: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'sidebar': '240px',
        'topbar': '64px',
      },
      maxWidth: {
        'content': '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
