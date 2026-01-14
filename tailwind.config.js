/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // Scan these files for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D8CFF',      // Custom blue color for Join Us button
        dark: '#000000',          // Black shadow / dark color
      },
      boxShadow: {
        btn: '0 4px 6px rgba(0, 0, 0, 0.3)', // Custom button shadow
      },
      transitionProperty: {
        'button': 'background-color, transform', // For hover effect
      },
      animation: {
        bounceSlow: 'bounce 2s infinite',       // Optional bounce effect
      },
    },
  },
  plugins: [],
}
