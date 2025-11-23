import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BRAND COLORS
        brand: {
          primary: {
            lightest: '#CCFBF1',
            light: '#5EEAD4',
            DEFAULT: '#14B8A6',
            dark: '#0F766E',
            darker: '#134E4A',
            darkest: '#042F2E',
          },
          accent: {
            lightest: '#FED7AA',
            light: '#FDBA74',
            DEFAULT: '#F97316',
            dark: '#EA580C',
            darker: '#C2410C',
          },
          secondary: {
            lightest: '#EDE9FE',
            light: '#C4B5FD',
            DEFAULT: '#8B5CF6',
            dark: '#7C3AED',
            darker: '#6D28D9',
          }
        },
        // SURFACE COLORS
        surface: {
          ground: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          overlay: {
            light: 'rgba(248, 250, 252, 0.95)',
            dark: 'rgba(15, 23, 42, 0.75)',
          },
          hover: '#F1F5F9',
          pressed: '#E2E8F0',
        },
        // CONTENT COLORS
        content: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
          inverse: '#FFFFFF',
          link: '#14B8A6',
          linkHover: '#0F766E',
        },
        // BORDER COLORS
        border: {
          light: '#F1F5F9',
          DEFAULT: '#E2E8F0',
          medium: '#CBD5E1',
          dark: '#94A3B8',
          focus: '#14B8A6',
          error: '#EF4444',
        },
        // STATUS COLORS
        status: {
          success: {
            lightest: '#D1FAE5',
            light: '#A7F3D0',
            DEFAULT: '#10B981',
            dark: '#059669',
            darkest: '#047857',
          },
          error: {
            lightest: '#FEE2E2',
            light: '#FECACA',
            DEFAULT: '#EF4444',
            dark: '#DC2626',
            darkest: '#B91C1C',
          },
          warning: {
            lightest: '#FEF3C7',
            light: '#FDE68A',
            DEFAULT: '#F59E0B',
            dark: '#D97706',
            darkest: '#B45309',
          },
          info: {
            lightest: '#DBEAFE',
            light: '#BFDBFE',
            DEFAULT: '#3B82F6',
            dark: '#2563EB',
            darkest: '#1D4ED8',
          },
        },
        // FUNCTIONAL COLORS
        functional: {
          cheapest: {
            bg: '#FED7AA',
            text: '#C2410C',
            badge: '#F97316',
          },
          expensive: {
            bg: '#FEE2E2',
            text: '#B91C1C',
          },
          average: {
            bg: '#E2E8F0',
            text: '#475569',
          },
          available: '#10B981',
          unavailable: '#94A3B8',
          lowStock: '#F59E0B',
          promotion: {
            bg: '#FED7AA',
            text: '#C2410C',
            badge: '#F97316',
          },
          discount: {
            bg: '#CCFBF1',
            text: '#134E4A',
          },
          premium: {
            bg: '#EDE9FE',
            text: '#6D28D9',
            badge: '#8B5CF6',
          },
          substitution: {
            pending: '#FEF3C7',
            approved: '#D1FAE5',
            rejected: '#FEE2E2',
          },
          category: {
            fruits: '#DCFCE7',
            meat: '#FEE2E2',
            dairy: '#DBEAFE',
            bakery: '#FEF3C7',
            frozen: '#E0E7FF',
            beverages: '#FCE7F3',
          }
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-premium': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      },
    },
  },
  plugins: [],
}

export default config

