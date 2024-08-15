import { ObjectSchema, mixed, number, object, string } from 'yup';
import {
  IUrlDTO,
  IGetAllQuery,
  IIdParam,
  ISignInDTO,
  IUserDTO,
  TOrder,
  ICodeParam,
} from '../../types';

export const urlSchema: ObjectSchema<IUrlDTO> = object({
  url: string()
    .required()
    .test({
      name: 'password',
      skipAbsent: true,
      test(value, ctx) {
        if (
          !value.match(
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
          )
        ) {
          return ctx.createError({
            message: 'Url invalid',
          });
        }
        return true;
      },
    }),
});

export const userSchema: ObjectSchema<IUserDTO> = object({
  name: string().required().min(3).max(150),
  email: string().email().required(),
  password: string()
    .required()
    .test({
      name: 'password',
      skipAbsent: true,
      test(value, ctx) {
        const fTest = !(
          value.match(/[a-z]/) &&
          value.match(/[A-Z]/) &&
          value.match(/\d+/) &&
          value.match(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
        );
        if (value.length < 10) {
          return ctx.createError({
            message: 'password must be at least 10 characters',
          });
        } else if (fTest) {
          return ctx.createError({
            message:
              'password invalid, must including at least one number, one  upper case letter, one  down case letter and one special character',
          });
        }
        return true;
      },
    }),
});

export const signInSchema: ObjectSchema<ISignInDTO> = object({
  email: string().required(),
  password: string().required(),
});

export const idParamSchema: ObjectSchema<IIdParam> = object({
  id: number().integer().required().min(1),
});

export const codeParamSchema: ObjectSchema<ICodeParam> = object({
  code: string().required(),
});

export const getAllSchema = (
  orderByList: string[],
): ObjectSchema<IGetAllQuery> => {
  type TOrderBy = (typeof orderByList)[number];

  return object({
    page: number().integer().optional().min(1),
    limit: number().integer().optional().min(1),
    orderBy: mixed<TOrderBy>()
      .optional()
      .oneOf([...orderByList]),
    order: mixed<TOrder>().optional().oneOf(['asc', 'desc']),
  });
};
