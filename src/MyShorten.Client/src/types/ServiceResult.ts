import { FormikErrors } from 'formik';

export interface IServiceResult<T, F> {
  success: boolean;
  data?: T;
  errors?: FormikErrors<F>;
}
