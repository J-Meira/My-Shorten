import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Formik, FormikProps } from 'formik';

import { Input, PublicContainer, SEO } from '../components';

import { signUpSchema } from '../utils/schemas';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getAuthenticated,
  removeLoading,
  setLoading,
} from '../redux/slices';
import { Button, Grid, List, ListItem, Typography } from '@mui/material';
import { ISignUpData } from '../@types';
import { authServices } from '../services';
import { useToast } from '../utils/hooks';
import { msgsDict } from '../utils/functions';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

export const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();
  const [passCheck, setPassCheck] = useState({
    size: false,
    low: false,
    upper: false,
    number: false,
    special: false,
  });
  const isAuthenticated = useAppSelector(getAuthenticated);
  const formRef = useRef<FormikProps<ISignUpData>>(null);

  const onSubmit = async (data: ISignUpData) => {
    dispatch(setLoading('signUp'));
    const result = await authServices.signUp(data);
    dispatch(removeLoading('signUp'));
    if (result.success) {
      useToast.success('Sign Up Complete');
      navigate('/sign-in');
    }
  };

  const validate = (formik: FormikProps<ISignUpData>) => {
    if (!formik.isValid) useToast.error(msgsDict('form'));
    formik.handleSubmit();
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPassCheck({
      size: v.length >= 10,
      low: /[a-z]/.test(v),
      upper: /[A-Z]/.test(v),
      number: /\d+/.test(v),
      special: /.[!,@,#,$,%,^,&,*,?,_,~,-,(,),.]/.test(v),
    });
  };

  const keyCheck = (
    e: React.KeyboardEvent<
      | HTMLInputElement
      | HTMLButtonElement
      | HTMLDivElement
      | HTMLTextAreaElement
    >,
  ) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      formRef?.current?.handleSubmit();
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate(state?.from || '/dashboard');
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <>
      <SEO title='My Shorten - Sign Up' />
      <PublicContainer>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
          }}
          validationSchema={signUpSchema}
          onSubmit={(values) => onSubmit(values)}
          enableReinitialize
          innerRef={formRef}
        >
          {(formik) => (
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '1.4rem' }} variant='h2'>
                    Sign Up:
                  </Typography>
                </Grid>
                <Input
                  label='Name'
                  name='name'
                  autoComplete='name'
                  autoFocus
                  required
                  onKeyDown={keyCheck}
                  grid={{ lg: 12 }}
                />
                <Input
                  label='Email'
                  name='email'
                  autoComplete='email'
                  type='email'
                  required
                  onKeyDown={keyCheck}
                  grid={{ lg: 12 }}
                />
                <Input
                  model='password'
                  name='password'
                  autoComplete='password'
                  label='Password'
                  id='password'
                  required
                  onKeyDown={keyCheck}
                  onChange={onPasswordChange}
                  grid={{ lg: 12 }}
                />
                <Grid item xs={12}>
                  <Typography
                    variant='h3'
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      marginBottom: 2,
                    }}
                  >
                    Your password most contain at least:
                  </Typography>
                  <List>
                    <CheckItem
                      label='10 characters'
                      checked={passCheck.size}
                    />
                    <CheckItem
                      label='A lowercase letter'
                      checked={passCheck.low}
                    />
                    <CheckItem
                      label='A uppercase letter'
                      checked={passCheck.upper}
                    />
                    <CheckItem
                      label='A digit(number)'
                      checked={passCheck.number}
                    />
                    <CheckItem
                      label='A special character (!@#$%^&*?)'
                      checked={passCheck.special}
                    />
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption'>
                    Already have an account?
                    <br />
                    <Typography
                      component={Link}
                      variant='caption'
                      color='secondary.main'
                      to='/sign-in'
                    >
                      Sign In
                    </Typography>
                    .
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => validate(formik)}
                  >
                    Sign Up
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

interface CheckProps {
  checked: boolean;
  label: string;
}

const CheckItem = ({ checked, label }: CheckProps) => (
  <ListItem disablePadding>
    <Typography sx={{ fontSize: '0.8rem' }} color='primary'>
      {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
    </Typography>
    <Typography sx={{ marginLeft: 1, fontSize: '0.8rem', lineHeight: 2 }}>
      {label}
    </Typography>
  </ListItem>
);
