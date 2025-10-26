import { FormikErrors } from 'formik';

import { IServiceResult, ISignInData, ISignUpData, IUser } from '~/types';
import { useToast } from '~/utils/hooks';

import { api } from '.';

export interface IAuth {
  accessToken: string;
  expiresIn: string;
  user: IUser;
}

const signIn = async (payload: ISignInData): Promise<IAuth | void> => {
  try {
    const { data } = await api.post('/users/sign-in', payload);
    if (data) return data;
    return;
  } catch (errors: unknown) {
    if (!(errors as Error)?.message) useToast.error('Invalid credentials');
    return;
  }
};

const signUp = async (
  payload: ISignUpData,
): Promise<IServiceResult<null, ISignUpData>> => {
  try {
    const result = await api.post('/users/sign-up', payload);
    if (result)
      return {
        success: true,
        data: null,
      };
    return {
      success: false,
    };
  } catch (errors: unknown) {
    return {
      success: false,
      errors: (errors as Error)?.message
        ? {}
        : (errors as FormikErrors<ISignUpData>),
    };
  }
};

export const authServices = {
  signIn,
  signUp,
};
