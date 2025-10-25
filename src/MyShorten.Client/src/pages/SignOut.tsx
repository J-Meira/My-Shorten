import { useEffect } from 'react';

import { useAppDispatch } from '../redux/hooks';
import { signOut } from '../redux/slices';

export const SignOut = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(signOut());
  }, [dispatch]);
  return null;
};
