import loggedClient from '../https/loggedClient.http'

const baseAffirmation = "/admin/affirmations";

const affirmationApi = {
  getAffirmations: (pageNumber: number, pageSize: number) => loggedClient.get(baseAffirmation, { params: { pageNumber, pageSize } }),
  getAffirmation: (affirmationId: string) => loggedClient.get(`${baseAffirmation}/${affirmationId}`),
  deleteAffirmation: (affirmationId: string) => loggedClient.delete(`${baseAffirmation}/${affirmationId}`),
  editAffirmation: (affirmationId: string, data: any) => loggedClient.put(`${baseAffirmation}/${affirmationId}`, data),
  createAffirmation: (data: any) => loggedClient.post(baseAffirmation, data),
};

export default affirmationApi;