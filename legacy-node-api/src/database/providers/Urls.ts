import { StatusCodes } from 'http-status-codes';

import { Knex } from '../knex';

import { StatusError } from '../../models';
import { IUrl, IUrlInsert, ICreateRDTO, IGetAllQuery } from '../../types';

import { ETableNames } from '../ETableNames';

const count = async (userId: string): Promise<number | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.urls)
      .where('userId', userId)
      .count<[{ count: number }]>('* as count');

    return Number.isInteger(Number(count)) ? Number(count) : 0;
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching records',
      500,
    );
  }
};

const create = async (
  data: IUrlInsert,
): Promise<ICreateRDTO | StatusError> => {
  try {
    const [result] = await Knex(ETableNames.urls).insert(data);
    return { id: result };
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while creating the record',
      500,
    );
  }
};

const deleteById = async (id: number): Promise<void | StatusError> => {
  try {
    await Knex(ETableNames.urls).del().where('id', id);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while deleting the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getAll = async (
  query: IGetAllQuery,
  userId: string,
): Promise<IUrl[] | StatusError> => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const result = await Knex.select('*')
      .from(ETableNames.urls)
      .where('userId', userId)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(query.orderBy || 'id', query.order);

    return result;
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching records',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getById = async (id: number): Promise<IUrl | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.urls)
      .where('id', id)
      .first();

    if (result) return result;

    return new StatusError('Record Not Found', StatusCodes.NOT_FOUND);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getByCode = async (code: string): Promise<IUrl | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.urls)
      .where('code', code)
      .first();

    if (result) return result;

    return new StatusError('Record Not Found', StatusCodes.NOT_FOUND);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const UrlsProvider = {
  count,
  create,
  deleteById,
  getAll,
  getById,
  getByCode,
};
