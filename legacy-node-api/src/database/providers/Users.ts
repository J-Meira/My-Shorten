import { StatusCodes } from 'http-status-codes';

import { Knex } from '../knex';

import { StatusError } from '../../models';
import { IUser, IUserDTO, ICreateRDTO } from '../../types';

import { ETableNames } from '../ETableNames';
import { HashService } from '../../utils/services';

const create = async (
  data: IUserDTO,
): Promise<ICreateRDTO | StatusError> => {
  try {
    const [{ count }] = await Knex(ETableNames.users)
      .where('email', '=', data.email)
      .count<[{ count: number }]>('* as count');

    if (count > 0) {
      return new StatusError(
        'Email has already been registered',
        StatusCodes.BAD_REQUEST,
      );
    }

    const hashPassword = await HashService.make(data.password);
    const [result] = await Knex(ETableNames.users).insert({
      ...data,
      password: hashPassword,
    });

    return { id: result };
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while creating the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getById = async (id: number): Promise<IUser | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.users)
      .where('id', id)
      .first();

    if (result) return result;

    return new StatusError('Record Not Found', StatusCodes.BAD_REQUEST);
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getByEmail = async (email: string): Promise<IUser | StatusError> => {
  try {
    const result = await Knex.select('*')
      .from(ETableNames.users)
      .where('email', email)
      .first();

    if (result) return result;

    return new StatusError(
      'email or password are not valid',
      StatusCodes.BAD_REQUEST,
    );
  } catch (error) {
    console.error(error);
    return new StatusError(
      'An internal error occurred while fetching the record',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const UsersProvider = {
  create,
  getById,
  getByEmail,
};
