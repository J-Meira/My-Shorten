import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authSlice, systemSlice, urlsSlice } from './slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    urls: urlsSlice.reducer,
    system: systemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
