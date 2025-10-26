import { FormikErrors } from 'formik';

import {
  IGetAllParams,
  IList,
  IUrl,
  IUrlForm,
  IServiceResult,
} from '~/types';
import { useToast } from '~/utils/hooks';

import { api } from '.';

const getAll = async (
  params: IGetAllParams,
): Promise<IList<IUrl> | void> => {
  try {
    const { data } = await api.get('/urls', { params });
    if (data) return data;
    return;
  } catch {
    return;
  }
};

const getByCode = async (code: string): Promise<IUrl | void> => {
  try {
    const { data } = await api.get(`/urls/code/${code}`);
    if (data) return data;
    return;
  } catch {
    return;
  }
};

const create = async (
  record: IUrlForm,
): Promise<IServiceResult<IUrl, IUrlForm>> => {
  try {
    const result = await api.post(`/urls`, record);
    if (result.data)
      return {
        success: true,
        data: result.data,
      };
    return {
      success: false,
    };
  } catch (errors) {
    return {
      success: false,
      errors: (errors as Error)?.message
        ? {}
        : (errors as FormikErrors<IUrlForm>),
    };
  }
};

const deleteById = async (id: number): Promise<boolean | void> => {
  try {
    const result = await api.delete(`/urls/${id}`);
    if (result) {
      useToast.success('Url deleted');
      return true;
    }
    return;
  } catch {
    return;
  }
};

export const urlServices = {
  getAll,
  getByCode,
  create,
  deleteById,
};
