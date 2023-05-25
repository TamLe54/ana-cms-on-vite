import loggedClient from '../https/loggedClient.http'

const baseDocument = "/documents";

const uploadApi = {
  requestUpload: (documentType: string) => loggedClient.post(`${baseDocument}/requestUpload`, { documentType }),
  upload: (data: FormData) => loggedClient.post(`${baseDocument}/upload`, data,{ headers:{"Content-Type": "multipart/form-data"}}),
};

export default uploadApi;