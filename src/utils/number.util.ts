const numberUtil = {
  formatIntDisplay: (value: number) => {
    const formatter = new Intl.NumberFormat("en-EN");

    return formatter.format(value);
  },
  formatPriceDisplay: (value: number) => {
    const formatter = new Intl.NumberFormat("en-EN");

    return formatter.format(value) + "đ";
  },
  formatIntToHoursDisplay: (value: number) => {
    return `${Math.round(value / 60)} giờ ${value % 60} phút`;
  },
};

export const { formatIntDisplay } = numberUtil;

export default numberUtil;
