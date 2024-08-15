import { Box, Button, Typography } from '@mui/material';
import { Container, SEO } from '../components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux';
import { removeLoading, setLoading } from '../redux/slices';
import { urlServices } from '../services';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { code } = useParams();

  const getUrl = async () => {
    if (code) {
      dispatch(setLoading('createUrl'));
      const result = await urlServices.getByCode(code);
      dispatch(removeLoading('createUrl'));
      if (result) {
        location.replace(result.original);
      } else {
        navigate('/not-found');
      }
    }
  };
  useEffect(() => {
    getUrl();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <SEO />
      <Container size='lg'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            color='primary.main'
            variant='h2'
            fontWeight={600}
            fontSize={48}
          >
            My Shorten
          </Typography>
          <Typography fontSize={12}>URL shortener app</Typography>
          <Button
            color='secondary'
            sx={{ mt: 4 }}
            component={Link}
            to='/sign-up'
            variant='contained'
          >
            Sign up now for free
          </Button>
        </Box>
      </Container>
    </>
  );
};
