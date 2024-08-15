import { ValidationError } from 'yup';
import { TProperty, TValidation } from '../../types';
import { StatusCodes } from 'http-status-codes';

export const validation: TValidation =
  (schemas) => async (req, res, next) => {
    let errors: ValidationError['errors'] = [];
    Object.entries(schemas).forEach(([key, schema]) => {
      try {
        schema.validateSync(req[key as TProperty], {
          abortEarly: false,
        });
      } catch (error) {
        const errorData = error as ValidationError;
        errors = errors.concat(errorData.errors);
      }
    });

    return errors.length > 0
      ? res.status(StatusCodes.BAD_REQUEST).json({ errors })
      : next();
  };
