import { Outlet } from 'react-router-dom';

import { Paper } from '@mui/material';

import { Header } from './components';

import { useAppSelector } from './redux/hooks';

export const Layout = () => {
  const { backgroundColor } = useAppSelector((state) => state.system);

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: backgroundColor,
      }}
      className='scroll-y'
      square
      elevation={0}
    >
      <Header />
      <Outlet />
    </Paper>
  );
};
