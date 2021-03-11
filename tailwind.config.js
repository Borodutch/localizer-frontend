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
      boxShadow: {
        card: '0 20px 50px 0 rgba(0, 0, 0, 0.05)',
        blue: '0 20px 50px 0 rgba(0, 0, 255, 0.05)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
