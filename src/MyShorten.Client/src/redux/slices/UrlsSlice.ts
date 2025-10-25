import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IGetAllParams, IList, IUrl } from '../../@types';
import { urlServices } from '../../services';

import { AppThunk } from '..';
import { removeLoading, setLoading } from '.';

interface IUrlsState extends IList<IUrl> {}

const initialState: IUrlsState = {
  totalOfRecords: 0,
  records: [],
};

export const getAllUrls =
  (payload: IGetAllParams): AppThunk =>
  (dispatch) => {
    dispatch(setLoading('getAllUrls'));
    urlServices.getAll(payload).then((r) => {
      dispatch(removeLoading('getAllUrls'));

      if (r) dispatch(urlsSlice.actions.setRecords(r));
    });
  };

export const deleteUrl =
  (payload: number): AppThunk =>
  (dispatch) => {
    dispatch(setLoading('deleteUrl'));
    urlServices.deleteById(payload).then((r) => {
      dispatch(removeLoading('deleteUrl'));

      if (r) dispatch(urlsSlice.actions.deleteRecord());
    });
  };

export const urlsSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    setRecords: (state, { payload }: PayloadAction<IList<IUrl>>) => {
      state.records = payload.records;
      state.totalOfRecords = payload.totalOfRecords;
    },
    deleteRecord: (state) => {
      state.totalOfRecords--;
    },
    AddUrl: (state) => {
      state.totalOfRecords++;
    },
  },
});

export const { AddUrl } = urlsSlice.actions;
