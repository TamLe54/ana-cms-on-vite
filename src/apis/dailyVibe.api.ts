import loggedClient from '../https/loggedClient.http'

const baseDailyVibe = "/admin/dailyVibes";

const dailyVibeApi = {
  getDailyVibes: (pageNumber: number, pageSize: number) => loggedClient.get(baseDailyVibe, { params: { pageNumber, pageSize } }),
  getDailyVibe: (dailyVibeId: string) => loggedClient.get(`${baseDailyVibe}/${dailyVibeId}`),
  deleteDailyVibe: (dailyVibeId: string) => loggedClient.delete(`${baseDailyVibe}/${dailyVibeId}`),
  editDailyVibe: (dailyVibeId: string, data: any) => loggedClient.put(`${baseDailyVibe}/${dailyVibeId}`, data),
  createDailyVibe: (data: any) => loggedClient.post(baseDailyVibe, data),
};

export default dailyVibeApi;