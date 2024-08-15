import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../redux/hooks';
import { getAuthenticated } from '../redux/slices';

export const RequireAuth = () => {
  const isAuthenticated = useAppSelector(getAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' state={{ from: location }} />;
  }

  return <Outlet />;
};
