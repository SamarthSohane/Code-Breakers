import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
            from: { opacity: '1' },
            to: { opacity: '0' },
        },
        'scale-in': {
            from: { transform: 'scale(0.9)' },
            to: { transform: 'scale(1)' },
        },
        'paw-in-left': {
          '0%': { transform: 'translateX(-200%) scale(0.5)', opacity: '0' },
          '60%': { transform: 'translateX(0) scale(1.2)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'paw-in-right': {
          '0%': { transform: 'translateX(200%) scale(0.5)', opacity: '0' },
          '60%': { transform: 'translateX(0) scale(1.2)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'text-fade-in': {
          '0%, 50%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'logo-in': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 1s ease-in-out',
        'fade-out': 'fade-out 1s ease-in-out forwards',
        'scale-in': 'scale-in 1s cubic-bezier(0.25, 1, 0.5, 1)',
        'paw-in-left': 'paw-in-left 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
        'paw-in-right': 'paw-in-right 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
        'text-fade-in': 'text-fade-in 2s ease-out forwards',
        'logo-in': 'logo-in 4s ease-in-out infinite 1.5s',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
