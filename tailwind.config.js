module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
