import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleErrors } from './HandleErrors';
import { StatusError } from '../../models';
import { JWTService } from '../services';

const userSecret = process.env.SYSTEM_SECRET;

const user = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization)
    return handleErrors(
      new StatusError('Without token', StatusCodes.UNAUTHORIZED),
      res,
    );

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer')
    return handleErrors(
      new StatusError(
        'invalid authorization type',
        StatusCodes.UNAUTHORIZED,
      ),
      res,
    );

  if (!userSecret)
    return handleErrors(
      new StatusError(
        'Internal server error',
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
      res,
    );

  const decoded = JWTService.verify(token, userSecret);
  if (decoded === 'INVALID_TOKEN')
    return handleErrors(
      new StatusError('invalid token', StatusCodes.UNAUTHORIZED),
      res,
    );

  req.headers.decoded = decoded.uid.toString();
  return next();
};

export const Auth = {
  user,
};
