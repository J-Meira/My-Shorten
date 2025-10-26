import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatusError } from '../models';
import { IUserDTO, ISignInDTO } from '../types';

import { UsersProvider } from '../database/providers';

import { handleErrors, validation } from '../utils/middleware';
import { userSchema, signInSchema } from '../utils/schemas';
import {
  ExpireInService,
  HashService,
  JWTService,
} from '../utils/services';

const userSecret = process.env.SYSTEM_SECRET;

const signUpValidation = validation({ body: userSchema });

const signUp = async (req: Request<{}, {}, IUserDTO>, res: Response) => {
  const result = await UsersProvider.create(req.body);
  if (result instanceof StatusError) {
    return handleErrors(result, res);
  } else {
    return res.status(StatusCodes.CREATED).json(result);
  }
};

const signInValidation = validation({
  body: signInSchema,
});

const signIn = async (req: Request<{}, {}, ISignInDTO>, res: Response) => {
  const { email, password } = req.body;

  const user = await UsersProvider.getByEmail(email);

  if (user instanceof StatusError) {
    return handleErrors(user, res);
  }

  const passwordTest = await HashService.verify(password, user.password);

  if (!passwordTest)
    return handleErrors(
      new StatusError(
        'email or password are not valid',
        StatusCodes.BAD_REQUEST,
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

  const expiresIn = ExpireInService.get(24);
  const accessToken = JWTService.make(
    {
      uid: user.id,
      name: user.name,
      expiresIn,
    },
    userSecret,
    '24h',
  );
  return res.status(StatusCodes.OK).json({
    accessToken,
    expiresIn,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const UsersController = {
  signIn,
  signInValidation,
  signUp,
  signUpValidation,
};
