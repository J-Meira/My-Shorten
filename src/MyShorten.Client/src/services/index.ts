import axios, { AxiosError, AxiosResponse } from 'axios';

import { objectToCamel } from 'ts-case-convert';

import { env } from '~/config';
import { router } from '~/router';
import { msgsDict } from '~/utils/functions';
import { useCookies, useToast } from '~/utils/hooks';

interface IError {
  [key: string]: string[];
}

interface IErrorData {
  errors?: IError;
  title?: string;
  message?: string;
  status: number;
  type: string;
}

const api = axios.create({
  baseURL: env.apiURL,
});

api.interceptors.request.use(async (config) => {
  const accessToken = useCookies.get('MS_AT');

  if (env.delay) await new Promise((resolve) => setTimeout(resolve, 1000));

  config.headers['Accept-Language'] = 'en-US';

  if (!accessToken) return config;

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<IErrorData>) => {
    const response = error.response as AxiosResponse;
    if (!error.response) {
      useToast.error(msgsDict('network'));
      return Promise.reject(error);
    }
    const fromHome =
      error.request?.responseURL &&
      error.request.responseURL.includes('/urls/code');
    const { status } = response;
    const data = response.data as IErrorData;
    switch (status) {
      case 400:
        if (data.errors) {
          const errors = objectToCamel(
            Object.fromEntries(
              Object.entries(data.errors).map(([key, value]) => [
                key,
                value[0],
              ]),
            ),
          );
          throw errors;
        }
        if (data.title) useToast.error(data.title);
        if (data.message) useToast.error(data.message);
        break;
      case 401:
        useToast.error('Session Expired');
        router.navigate('/sign-out');
        break;
      case 404:
        if (!fromHome) useToast.error('Not Found');
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
