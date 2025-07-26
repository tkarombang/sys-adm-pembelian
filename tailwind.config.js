// /** @type {import('tailwindcss').Config} */
const content = {
  content: [
    "./views/**/*.{ejs, html}",
    "./public/**/*.js"
  ],
  safelist: [
    'p-2',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = content;