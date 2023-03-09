module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
}
