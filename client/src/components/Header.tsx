import { useEffect, useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import { MdArrowDropDown } from 'react-icons/md';

import { Logo } from './Logo';
import { ThemeSwitch } from './ThemeSwitch';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { signOut } from '../redux/slices';

export const Header = () => {
  const dispatch = useAppDispatch();
  const matches = useMediaQuery('(max-width:899px)');
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    setAnchorEl(null);
    setIsOpen(false);
    dispatch(signOut());
  };
  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const getAvatar = (label: string) => {
    const s = label.split(' ');
    const v =
      s.length > 1 ? `${s[0][0]}${s[1][0]}` : `${s[0][0]}${s[0][1]}`;
    return v.toUpperCase();
  };

  useEffect(() => {
    if (isOpen && !matches) setIsOpen(false);
  }, [matches, isOpen]);

  return (
    <>
      <AppBar color='inherit' component='nav'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo auth />
          <Box display='flex' alignItems='center'>
            <ThemeSwitch />
            <Box
              sx={{ marginLeft: 2, cursor: 'pointer' }}
              display='flex'
              alignItems='center'
              onClick={openMenu}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'secondary.light',
                  fontSize: '0.8rem',
                }}
              >
                {getAvatar(user?.name || 'user')}
              </Avatar>
              <Typography
                sx={{ ml: 1, display: { xs: 'none', md: 'flex' } }}
              >
                {`${user?.name || 'user'}`} <MdArrowDropDown />
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl != null}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  );
};
