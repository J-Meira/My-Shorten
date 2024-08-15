import { api } from '.';

import {
  IServiceResult,
  ISignInData,
  ISignUpData,
  IUser,
} from '../@types';

export interface IAuth {
  accessToken: string;
  expiresIn: string;
  user: IUser;
}

const signIn = async (payload: ISignInData): Promise<IAuth | void> => {
  try {
    const { data } = await api.post('/sign-in', payload);
    if (data) return data;
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const signUp = async (
  payload: ISignUpData,
): Promise<IServiceResult<null>> => {
  try {
    const result = await api.post('/sign-up', payload);
    if (result)
      return {
        success: true,
        data: null,
      };
    return {
      success: false,
    };
  } catch (errors) {
    console.log(errors);
    return {
      success: false,
    };
  }
};

export const authServices = {
  signIn,
  signUp,
};
