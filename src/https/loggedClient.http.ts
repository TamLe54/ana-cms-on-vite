import axios from 'axios';

const loggedClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
  timeout: 60000,
});

export const loggedClientFunc = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60000,
  });

export default loggedClient;
