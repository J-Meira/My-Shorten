import { Box, Card, IconButton } from '@mui/material';

import {
  MdDarkMode as DarkModeIcon,
  MdLightMode as LightModeIcon,
} from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { handleTheme } from '../redux/slices';

export const ThemeSwitch = () => {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.system);
  return (
    <Box
      onClick={() => dispatch(handleTheme())}
      className={`theme-switch${isDark ? ' theme-switch-dark' : ''}`}
    >
      <Card className='board'></Card>
      <IconButton
        size='small'
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {isDark ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
};
