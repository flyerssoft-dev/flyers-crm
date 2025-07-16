module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#7700C7',
        secondary: '#F4EDFF',
        darkPurple: '#1A032A',
        primaryDark: '#9222d4',
        white: '#FFFFFF',
        mildWhite: '#FAF7FF',
        black: '#0E0D0E',
        darkBlack: '#222222',
        violet: '#7700C7',
        red: '#D20F0F',
        yellow: '#FAB020',
        green: '#29B95F',
        gray: '#CDCDCD',
        dropShadow: '#606060',
        grayText: '#989898',
        grayDark: '#4A4A4A',
        graySurface: '#F1F1F1',
        table: '#F7F7F7',
        lightPurple: '#F2EBF5',
        blackBorder: '#000000',
        DatePicker: '#000000e0',
        purpleCard: '#A070D3',
        greenCard: '#46AB58',
        yellowCard: '#E76B4D',
        firstAvatharColor: '#4c1d95',
        secondAvatharColor: '#6366f1',
      },
      fontFamily: {
        lato: ['Outfit', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      backgroundImage: {
        'login-bg': "url('@/assets/images/LoginBackgroundimg.jpg')",
      },
      screens: {
        xs: '420px',
      },
      height: {
        'fill-available': '-webkit-fill-available',
      },
    },
  },
  plugins: [],
};
