import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatusError } from '../models';
import {
  IUrlDTO,
  IGetAllQuery,
  IIdParam,
  TKUrl,
  ICodeParam,
} from '../types';

import { UrlsProvider } from '../database/providers';

import { handleErrors, validation } from '../utils/middleware';
import {
  urlSchema,
  getAllSchema,
  idParamSchema,
  codeParamSchema,
} from '../utils/schemas';

const handleIdParams = (res: Response) =>
  handleErrors(
    new StatusError('Param "id" is a required', StatusCodes.BAD_REQUEST),
    res,
  );

const createValidation = validation({ body: urlSchema });

const create = async (req: Request<{}, {}, IUrlDTO>, res: Response) => {
  const userId = req.headers.decoded;

  if (typeof userId !== 'string') {
    return handleErrors(
      new StatusError('invalid token', StatusCodes.UNAUTHORIZED),
      res,
    );
  }

  const mask =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 6; i > 0; --i)
    code += mask[Math.floor(Math.random() * mask.length)];

  const result = await UrlsProvider.create({
    code,
    original: req.body.url,
    userId: Number(userId),
  });
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.CREATED).json({
      id: result.id,
      code,
      original: req.body.url,
      userId: Number(userId),
    });
  }
};

const deleteByIdValidation = validation({
  params: idParamSchema,
});

const deleteById = async (req: Request<IIdParam>, res: Response) => {
  if (!req.params.id) return handleIdParams(res);

  const userId = req.headers.decoded;

  if (typeof userId !== 'string') {
    return handleErrors(
      new StatusError('invalid token', StatusCodes.UNAUTHORIZED),
      res,
    );
  }

  const test = await UrlsProvider.getById(req.params.id);
  if (!(test instanceof StatusError)) {
    if (test.userId !== Number(userId)) {
      return handleErrors(
        new StatusError('Url invalid', StatusCodes.BAD_REQUEST),
        res,
      );
    }
    const result = await UrlsProvider.deleteById(req.params.id);

    if (result instanceof StatusError) {
      return handleErrors(result, res);
    } else {
      return res.status(StatusCodes.NO_CONTENT).end();
    }
  } else {
    return handleErrors(test, res);
  }
};

const orderKeys: TKUrl[] = ['id', 'code', 'original'];

const getAllValidation = validation({
  query: getAllSchema(orderKeys),
});

const getAll = async (
  req: Request<{}, {}, {}, IGetAllQuery>,
  res: Response,
) => {
  const userId = req.headers.decoded;

  if (typeof userId !== 'string') {
    return handleErrors(
      new StatusError('invalid token', StatusCodes.UNAUTHORIZED),
      res,
    );
  }
  const result = await UrlsProvider.getAll(req.query, userId);
  const count = await UrlsProvider.count(userId);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else if (count instanceof StatusError) {
    return handleErrors(count, res);
  } else {
    return res.status(StatusCodes.OK).json({
      records: result,
      totalOfRecords: count,
    });
  }
};

const getByIdValidation = validation({
  params: idParamSchema,
});

const getById = async (req: Request<IIdParam>, res: Response) => {
  if (!req.params.id) return handleIdParams(res);

  const result = await UrlsProvider.getById(req.params.id);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.OK).json(result);
  }
};

const getByCodeValidation = validation({
  params: codeParamSchema,
});

const getByCode = async (req: Request<ICodeParam>, res: Response) => {
  if (!req.params.code) {
    return handleErrors(
      new StatusError(
        'Param "code" is a required',
        StatusCodes.BAD_REQUEST,
      ),
      res,
    );
  }

  const result = await UrlsProvider.getByCode(req.params.code);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.OK).json(result);
  }
};

export const UrlsController = {
  create,
  createValidation,
  deleteById,
  deleteByIdValidation,
  getAll,
  getAllValidation,
  getById,
  getByIdValidation,
  getByCode,
  getByCodeValidation,
};
