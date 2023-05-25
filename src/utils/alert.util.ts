import Swal from "sweetalert2";

const alertUtil = {
  error: (title?: string, content?: string) => {
    Swal.fire({
      title: title ?? "Error!",
      text: content ?? "Something went wrong",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#047857",
    });
  },
  info: (title?: string, content?: string) => {
    Swal.fire({
      title: title ?? "Info!",
      text: content ?? "Something went wrong",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#047857",
    });
  },
};

export default alertUtil;
