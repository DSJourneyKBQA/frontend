/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      backgroundColor: {
        'github': '#1c2128',
        'gh-card': '#22272e',
        'gh-active': '#22272e',
        'gh-btn': '#373e47',
        'gh-btn-hover': '#444c56',
      },
      borderColor: {
        'github': '#444c56',
        'gh-btn': '#464e57',
        'gh-btn-hover': '#768390',
      },
      textColor: {
        'github': '#adbac7',
        'gh-icon': '#768390',
      },
    },
  },
  plugins: [],
}
