import { AxiosError } from 'axios';
import { store } from '../store';
import loggedClient from './loggedClient.http';
import { Auth } from 'aws-amplify';
import { signOutAction } from '../store/auth/auth.thunk';

// Intercept all requests
loggedClient.interceptors.request.use(
  async config => {
    config.headers!.Authorization = `Bearer ${(await Auth.currentSession())
      .getIdToken()
      .getJwtToken()}`;

    return config;
  },
  error => Promise.reject(error),
);

// Intercept all responses
loggedClient.interceptors.response.use(
  async response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(signOutAction());
      Auth.signOut({
        global: true,
      });
    }

    if (error.response?.status === 400) {
      // if (error.response.data.errors?.includes("jwt expired")) {
      //   store.dispatch(signOut());
      // }
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // alertUtil.error(
      //   error.response.statusText,
      //   error.response.data?.messages?.toString() || ""
      // );
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the
      // browser and an instance of
      // http.ClientRequest in node.js
      // alertUtil.error(error.message, error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // alertUtil.error(error.message);
    }

    return Promise.reject(error);
  },
);
