import { api } from '.';

import {
  IGetAllParams,
  IList,
  IUrl,
  IUrlForm,
  IServiceResult,
} from '../@types';
import { useToast } from '../utils/hooks';

const getAll = async (
  params: IGetAllParams,
): Promise<IList<IUrl> | void> => {
  try {
    const { data } = await api.get('/urls', { params });
    if (data) return data;
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getByCode = async (code: string): Promise<IUrl | void> => {
  try {
    const { data } = await api.get(`/get-url/${code}`);
    if (data) return data;
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const create = async (record: IUrlForm): Promise<IServiceResult<IUrl>> => {
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
    console.log(errors);
    return {
      success: false,
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
  } catch (error) {
    console.log(error);
    return;
  }
};

export const urlServices = {
  getAll,
  getByCode,
  create,
  deleteById,
};
