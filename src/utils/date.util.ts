import moment from "moment";

export enum DateFormats {
  DATE_TO_REQUEST = "YYYY-MM-DDT00:00:00",
  FULL_DATE_TO_DISPLAY = "DD/MM/YYYY",
  FULL_HOUR_DATE_TO_DISPLAY = "HH:mm DD/MM/YYYY",
  DASHBOARD_DATE = "dddd, MMMM Do YYYY",
  DATE_TO_COMPARE = "YYYY-MM-DD",
  SHORT_DATE = "DD/MM",
}

const dateUtil = {
  //Lấy được số ngày giữa hai Date
  getDateRange: (startDate: string, endDate: string) => {
    let dateRange = 1;

    //Format hai Date lại để chuẩn bị so sánh
    let startDateCompare = moment(startDate).format(
      DateFormats.DATE_TO_COMPARE
    );
    const endDateCompare = moment(endDate).format(DateFormats.DATE_TO_COMPARE);

    //Nếu ngày bắt đầu lại ở sau ngày kết thúc thì là lỗi, trả về -1
    if (moment(startDateCompare).isAfter(endDateCompare)) {
      return -1;
    }

    //Nếu ngày bắt đầu ở trước thì làm một vòng lặp
    while (moment(startDateCompare).isBefore(endDateCompare)) {
      //Kiểm tra khi nào ngày bắt đầu vượt quá ngày kết thúc
      //tắng số ngày ngày lên
      dateRange++;
      //Tăng ngày bắt đầu lên 1 ngày
      startDateCompare = moment(startDateCompare)
        .add(1, "d")
        .format(DateFormats.DATE_TO_COMPARE);
    }

    return dateRange;
  },
  //Các thuộc tính sau đó dùng để convert nhanh sang các định dạng phục vụ những mục đích khác nhau
  convertToDisplay: (date?: string | Date) => {
    return moment(date).format(DateFormats.FULL_DATE_TO_DISPLAY);
  },
  convertToDisplayWithHour: (date?: string | Date) => {
    return moment(date).format(DateFormats.FULL_HOUR_DATE_TO_DISPLAY);
  },
  convertToShortDateDisplay: (date?: string | Date) => {
    return moment(date).format(DateFormats.SHORT_DATE);
  },
  convertToRequest: (date?: string | Date) => {
    return moment(date).format(DateFormats.DATE_TO_REQUEST);
  },

  //Lấy ngày mai
  getTomorrow: () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);

    return now;
  },
  //Lấy ngày đầu tiên của tháng hiện tại
  getFirstDateOfCurrentMonth: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  //Lấy ngày cuối cùng của tháng hiện tại
  getLastDateOfCurrentMonth: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },
};

export default dateUtil;
