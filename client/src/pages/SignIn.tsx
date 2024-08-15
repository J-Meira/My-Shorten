import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Formik, FormikProps } from 'formik';

import { Input, PublicContainer, SEO } from '../components';

import { ISignInData } from '../@types';
import { signInSchema } from '../utils/schemas';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAuthenticated, signIn } from '../redux/slices';
import { Button, Grid, Typography } from '@mui/material';

export const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const isAuthenticated = useAppSelector(getAuthenticated);
  const formRef = useRef<FormikProps<ISignInData>>(null);

  const onSubmit = (data: ISignInData) => {
    dispatch(signIn(data));
  };

  useEffect(() => {
    if (isAuthenticated) navigate(state?.from || '/dashboard');
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <>
      <SEO title='My Shorten - Sign In' />
      <PublicContainer>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={signInSchema}
          onSubmit={(values) => onSubmit(values)}
          enableReinitialize
          innerRef={formRef}
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '1.4rem' }} variant='h2'>
                    Sign In:
                  </Typography>
                </Grid>
                <Input
                  label='Email'
                  name='email'
                  autoComplete='email'
                  autoFocus
                  required
                  grid={{ lg: 12 }}
                />
                <Input
                  model='password'
                  name='password'
                  autoComplete='password'
                  label='Password'
                  id='password'
                  required
                  grid={{ lg: 12 }}
                />
                <Grid item xs={12}>
                  <Typography variant='caption'>
                    Don't have an account?
                    <br />
                    <Typography
                      component={Link}
                      variant='caption'
                      color='secondary.main'
                      to='/sign-up'
                    >
                      Sign Up
                    </Typography>
                    .
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    fullWidth
                    sx={{ mt: 2 }}
                    type='submit'
                  >
                    Sign In
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </PublicContainer>
    </>
  );
};
