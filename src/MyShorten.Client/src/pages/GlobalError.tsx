import { FallbackProps, useErrorBoundary } from 'react-error-boundary';

import { Button, Typography } from '@mui/material';

import { PublicContainer } from '../components';

export const GlobalError = ({ error }: FallbackProps) => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <PublicContainer size='md'>
      <Typography
        sx={{ fontWeight: 600, fontSize: '2.2rem' }}
        variant='h2'
      >
        An error occurred
      </Typography>
      <Typography variant='body1'>
        <b>Details: </b>
        {error.message}
      </Typography>
      <Button
        color='secondary'
        sx={{ mt: 4 }}
        onClick={resetBoundary}
        fullWidth
      >
        Try again
      </Button>
    </PublicContainer>
  );
};
