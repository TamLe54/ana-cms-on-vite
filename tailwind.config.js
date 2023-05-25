/** @type {import('tailwindcss').Config} */
import themeConfig from './src/configs/theme.config.json';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: themeConfig.baseColors.primary,
        secondary: themeConfig.baseColors.secondary,
        success: themeConfig.alertColors.success,
        error: themeConfig.alertColors.error,
      },
    },
  },
  plugins: [],
};
