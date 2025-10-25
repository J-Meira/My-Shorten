import { object, string, ObjectSchema } from 'yup';

import { ISignInData, ISignUpData, IUrlForm } from '../@types';
import { msgsDict } from './functions';

const passwordSchema = () =>
  string().test({
    name: 'password',
    skipAbsent: true,
    test(value, ctx) {
      if (
        !value ||
        !(
          value.length >= 10 &&
          value.match(/[a-z]/) &&
          value.match(/[A-Z]/) &&
          value.match(/\d+/) &&
          value.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,),.]/)
        )
      ) {
        return ctx.createError({ message: msgsDict('password') });
      }
      return true;
    },
  });

export const signInSchema: ObjectSchema<ISignInData> = object({
  email: string().required(msgsDict()),
  password: string().required(msgsDict()),
});

export const signUpSchema: ObjectSchema<ISignUpData> = object({
  name: string().min(3, msgsDict('min', 3)).required(msgsDict()),
  email: string().email(msgsDict('email')).required(msgsDict()),
  password: passwordSchema().required(msgsDict()),
});

export const createUrlSchema: ObjectSchema<IUrlForm> = object({
  url: string()
    .required(msgsDict())
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
