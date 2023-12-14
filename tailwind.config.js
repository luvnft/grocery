/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        btn: {
          background: '#343298',
          'background-hover': 'hsl(var(--btn-background-hover))',
        },
      },
    },
    fontSize: {
      sm: ['14px', '16px'],
      base: ['16px', '18px'],
      lg: ['20px', '22px'],
      xl: ['24px', '26px'],
    }
  },
  plugins: [],
}
