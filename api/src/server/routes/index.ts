import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UrlsController } from '../../controllers';
import { UsersController } from '../../controllers/Users';
import { Auth } from '../../utils/middleware';

const router = Router();

/* heth start */
router.get('/', (_, res) => res.status(StatusCodes.OK).send('Hi!'));
/* heth end */

/* urls start */
router.post(
  '/urls',
  Auth.user,
  UrlsController.createValidation,
  UrlsController.create,
);

router.get(
  '/urls',
  Auth.user,
  UrlsController.getAllValidation,
  UrlsController.getAll,
);

router.get(
  '/urls/:id',
  Auth.user,
  UrlsController.getByIdValidation,
  UrlsController.getById,
);

router.delete(
  '/urls/:id',
  Auth.user,
  UrlsController.deleteByIdValidation,
  UrlsController.deleteById,
);

router.get(
  '/get-url/:code',
  Auth.user,
  UrlsController.getByCodeValidation,
  UrlsController.getByCode,
);
/* urls end */

/* auth start */
router.post(
  '/sign-in',
  UsersController.signInValidation,
  UsersController.signIn,
);

router.post(
  '/sign-up',
  UsersController.signUpValidation,
  UsersController.signUp,
);
/* auth end */

export { router };
