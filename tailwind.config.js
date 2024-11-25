/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Custom screen sizes
        'custom1': '700px', // Example custom size for small devices
        'custom2': '1000px', // Example custom size for medium devices
      },
    },
  },
  plugins: [],
}

