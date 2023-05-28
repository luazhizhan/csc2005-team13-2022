/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      borderRadius: {
        full: '50%',
      },
      boxShadow: {
        '3xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [require('prettier-plugin-tailwindcss')],
}
