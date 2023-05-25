const imageUtil = {
  formatImagePath: (imagePath: string) => {
    return `${import.meta.env.VITE_STATIC_SERVER}/${imagePath}`;
  },
};

export const { formatImagePath } = imageUtil;

export default imageUtil;
