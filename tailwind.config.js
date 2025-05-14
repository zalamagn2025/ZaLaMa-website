/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Couleurs personnalisées
        primary: {
          DEFAULT: 'var(--zalama-orange, #FF671E)',
          light: 'var(--zalama-orange-light, #FF8C5A)',
          dark: 'var(--zalama-orange-dark, #E55C1A)',
          foreground: 'var(--color-primary-foreground, #FFFFFF)'
        },
        // Garder les couleurs bleues pour les dégradés
        blue: {
          400: 'var(--zalama-blue-light, #60a5fa)',
          500: 'var(--zalama-blue, #3b82f6)',
          600: 'var(--zalama-blue-dark, #2563eb)',
        },
        // Autres couleurs d'état
        success: {
          DEFAULT: 'var(--zalama-success, #10b981)',
          foreground: '#FFFFFF'
        },
        warning: {
          DEFAULT: 'var(--zalama-warning, #f59e0b)',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: 'var(--zalama-danger, #ef4444)',
          foreground: '#FFFFFF'
        },
      },
      // Autres extensions de thème...
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
