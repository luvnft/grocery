/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF6EA',
        foreground: 'hsl(var(--foreground))',
        btn: {
          background: '#343298',
          'background-hover': 'hsl(var(--btn-background-hover))',
        },
        spilltNavy: '#343298',
        spilltCreme: '#FFF6EA',
        spilltLightPurple: '#F2F2FF',
      },
      fontFamily: {
        PermanentMarker: ['Permanent Marker'],
      }
    },
    fontSize: {
      sm: ['14px', '16px'],
      base: ['16px', '18px'],
      lg: ['20px', '22px'],
      xl: ['24px', '26px'],
      xxl: ['48px', '50px'],
    }
  },
  plugins: [],
}
