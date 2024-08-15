import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

import { ISignInData, IUser } from '../../@types';
import { IAuth, authServices } from '../../services';
import { router } from '../../router';
import { useCookies, useCrypto } from '../../utils/hooks';

import { AppThunk, RootState } from '..';
import { removeLoading, setLoading } from '.';

interface IAuthState {
  accessToken: string | null;
  expiresIn: number | null;
  user: IUser | null;
}

const localAccessToken = useCookies.get('MS_AT');
const localExpiresIn = localAccessToken
  ? localStorage.getItem('SG_EI_EP')
  : null;
const localUser = localAccessToken
  ? localStorage.getItem('SG_US_EP')
  : null;

const initialState: IAuthState = {
  user: localUser ? useCrypto.decrypt<IUser>(localUser) : null,
  expiresIn: localExpiresIn ? Number(localExpiresIn) : null,
  accessToken: localAccessToken ?? null,
};

export const signIn =
  (payload: ISignInData): AppThunk =>
  (dispatch) => {
    dispatch(setLoading('signIn'));
    authServices.signIn(payload).then((r) => {
      dispatch(removeLoading('signIn'));
      if (r) dispatch(authSlice.actions.setAuth(r));
    });
  };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      useCookies.remove('MS_AT');
      localStorage.removeItem('SG_EI_EP');
      localStorage.removeItem('SG_US_EP');
      state.user = null;
      state.accessToken = null;
      state.expiresIn = null;

      router.navigate('/sign-in');
    },
    setAuth: (state, { payload }: PayloadAction<IAuth>) => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const expiresIn = dayjs.tz(payload.expiresIn, tz).utc();
      const expiresInTime = dayjs(payload.expiresIn).toDate().getTime();
      localStorage.setItem('SG_EI_EP', JSON.stringify(expiresInTime));
      useCookies.set('MS_AT', payload.accessToken, expiresIn.toDate());
      const eUser = useCrypto.encrypt<IUser>(payload.user);

      if (eUser) {
        localStorage.setItem('SG_US_EP', eUser);
      }

      state.accessToken = payload.accessToken;
      state.expiresIn = expiresInTime;
      state.user = payload.user;
    },
  },
});

export const { signOut } = authSlice.actions;

export const getAuthenticated = (state: RootState): boolean =>
  !!state.auth.accessToken;
