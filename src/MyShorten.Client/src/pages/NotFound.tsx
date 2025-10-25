import { Link } from 'react-router-dom';

import { Button, Typography } from '@mui/material';

import { PublicContainer } from '../components';

export const NotFound = () => (
  <PublicContainer size='md'>
    <Typography sx={{ fontWeight: 600, fontSize: '2.2rem' }} variant='h2'>
      Not found
    </Typography>
    <Typography variant='body1'>
      Oops - we could not find what your are looking for!
    </Typography>
    <Button
      color='secondary'
      sx={{ mt: 4 }}
      component={Link}
      to='/'
      fullWidth
    >
      Go back to home
    </Button>
  </PublicContainer>
);
