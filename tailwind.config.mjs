/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        major: '#006cb7',
        minor: '#ff8e01',
        sharp: '#8ac73d',
      },
    },
  },
  plugins: [],
}
