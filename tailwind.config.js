module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  separator: '_',
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans'],
    },
    extend: {
      colors: {
        'primary-blue': '#377DFF',
        'primary-green': '#2DCA8C',
        'primary-orange': '#FFBE3D',
        'primary-red': '#FF715B',
        'additional-blue': '#E5F1FF',
        'additional-green': '#EAFAF3',
        'additional-orange': '#FFF2D8',
        'additional-red': '#FFE3DE',
        'text-dark': '#333333',
        'text-silver': '#858A8F',
        'text-light': '#AAB0B7',
        'back-white': '#FFFFFF',
        'back-gray': '#F5F6FA',
        'back-silver': '#EDEEF6',
        'back-dark': '#0D0D0D',
        'back-light-dark': '#171717',
        'dark-card-border': '#202020',
        'text-milk': '#E0E0E0',
      },
      boxShadow: {
        blue: '0 20px 30px 0 rgba(0, 0, 255, 0.05)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
