import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

interface Props {
  auth?: boolean;
}

export const Logo = ({ auth }: Props) => (
  <Typography
    variant='h1'
    color='primary'
    sx={{
      textDecoration: 'none',
      fontSize: '1.2rem',
      fontWeight: 700,
      paddingTop: '1rem',
      paddingBottom: '1rem',
      color: 'primary.main',
    }}
    component={Link}
    to={auth ? '/dashboard' : '/'}
  >
    My Shorten
  </Typography>
);
