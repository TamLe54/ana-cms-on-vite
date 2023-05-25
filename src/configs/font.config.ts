import { CustomFontFace } from 'unplugin-fonts/types';

interface FontFace {
  name: string;
  src: string;
  transform?: (font: CustomFontFace) => CustomFontFace;
}

const generateFontFace = (
  name: string,
  src: string,
  weight: number,
): FontFace => {
  const newFontFace: FontFace = {
    name: name,
    src: src,
    transform: (font: CustomFontFace) => {
      if (font.basename === 'WorkSans-Regular') {
        // update the font weight
        font.weight = weight;
      }
      return font;
    },
  };
  return newFontFace;
};

export default generateFontFace;
