import uploadApi from "@apis/upload.api";

//Lấy ra type mime từ chuỗi base64 bằng cách lấy chuỗi con ở giữa dấu : và dấu ;
function detectMimeType(b64: string) {
  return b64.substring(b64.indexOf(":") + 1, b64.indexOf(";"));
}

//Hàm convert một chuỗi base64 thành một đối tượng blob
function b64toBlob(dataURI: string) {
  const parts = dataURI.split(";base64,");

  const imageType = parts[0].split(":")[1];

  const byteString = window.atob(parts[1]);

  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: imageType });
}

//Định nghĩa enum bao gồm các dạng DailyVibe để truy vấn upload
enum DocumentType {
  DailyVibeAudio = "dailyVibeAudio",
  DailyVibeImage = "dailyVibeImage",
}

//Hàm upload, nhận vào một chuỗi base64
const uploadMedia = async (media: string /* base64 URL */) => {
  try {
    // Yêu cầu đến database của backend một url để được upload một file audio
    const url = await uploadApi.requestUpload(DocumentType.DailyVibeAudio);

    // Tạo một đối tượng formdata
    const uploadFormData = new FormData();
    uploadFormData.append("url", url.data.data.uploadUrl); //đưa url nhận được từ backend vào url của formData
    uploadFormData.append("file", b64toBlob(media)); //Tạo một blob từ chuỗi base64 nhận vào sau đó đưa vào phần file của formData

    await uploadApi.upload(uploadFormData); //upload formData đó lên cloud!

    return url.data.data; //trả về lại dữ liệu trong đối tượng url gửi về từ backend
  } catch (error) {
    console.error("eee", error);
  }
};

export { uploadMedia, detectMimeType };
