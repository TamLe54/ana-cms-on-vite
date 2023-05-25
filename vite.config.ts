import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import reactRefresh from '@vitejs/plugin-react-refresh';
import Unfonts from 'unplugin-fonts/vite';
import generateFontFace from './src/configs/font.config';

const nameFont = 'WorkSans';
const sourceFont = (fontWeight: string) => {
  return `./src/assets/fonts/WorkSans/WorkSans-${fontWeight}.ttf`;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactRefresh(),
    Unfonts({
      // Custom fonts.
      custom: {
        families: [
          generateFontFace(nameFont, sourceFont('ExtraBold'), 800),
          generateFontFace(nameFont, sourceFont('Bold'), 700),
          generateFontFace(nameFont, sourceFont('SemiBold'), 600),
          generateFontFace(nameFont, sourceFont('Medium'), 500),
          generateFontFace(nameFont, sourceFont('Regular'), 400),
          generateFontFace(nameFont, sourceFont('Light'), 300),
        ],
        display: 'auto',
        preload: true,
        prefetch: false,
        injectTo: 'head-prepend',
      },
    }),
  ],
  define: {
    global: {},
  },
});
