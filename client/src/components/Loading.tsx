import { Box, CircularProgress, Paper, Typography } from '@mui/material';

import { useAppSelector } from '../redux/hooks';
import { getLoading } from '../redux/slices';

export const Loading = () => {
  const isLoading = useAppSelector(getLoading);
  return (
    <>
      <Paper
        square
        sx={{
          display: isLoading ? 'flex' : 'none',
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          right: 0,
          zIndex: 99998,
          opacity: [0.9, 0.8, 0.7],
        }}
      />
      <Paper
        square
        sx={{
          display: isLoading ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          right: 0,
          zIndex: 99999,
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            m: 1,
            position: 'relative',
            width: 120,
            height: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='h4'
            sx={{
              textDecoration: 'none',
              fontSize: '3rem',
              fontWeight: 700,
              padding: '1rem',
            }}
          >
            MS
          </Typography>
          <CircularProgress
            size={118}
            color='primary'
            sx={{
              position: 'absolute',
              zIndex: 1,
            }}
          />
        </Box>
        <Typography
          variant='caption'
          color='primary.main'
          sx={{
            fontSize: '1.5rem',
            fontWeight: '500',
          }}
        >
          Loading...
        </Typography>
      </Paper>
    </>
  );
};
