import axios, { AxiosError, AxiosResponse } from 'axios';

import { router } from '../router';
import { msgsDict } from '../utils/functions';
import { useCookies, useToast } from '../utils/hooks';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(async (config) => {
  const accessToken = useCookies.get('MS_AT');

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

interface IErrors {
  errors?: string[];
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const response = error.response as AxiosResponse<IErrors>;
    if (!error.response) {
      useToast.error(msgsDict('network'));
      return Promise.reject(error);
    }
    const { data, status } = response;
    switch (status) {
      case 400:
        if (data.errors) {
          try {
            useToast.error(data.errors.join('; '));
          } catch (error) {
            useToast.error(msgsDict('network'));
          }
        }
        break;
      case 401:
        useToast.error('Session Expired');
        router.navigate('/sign-out');
        break;
      case 404:
        useToast.error('Not Found');
        break;
      case 403:
        useToast.error('You are not allowed to do that!');
        break;
      case 500:
        useToast.error(msgsDict('network'));
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

export { api };
export * from './AuthServices';
export * from './UrlServices';
