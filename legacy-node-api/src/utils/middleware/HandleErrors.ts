import { Response } from 'express';

import { StatusError } from '../../models';

export const handleErrors = (error: StatusError, res: Response) =>
  res.status(error.status).json({
    errors: [error.message],
  });
