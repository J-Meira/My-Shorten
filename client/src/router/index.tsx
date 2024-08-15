import { Navigate, createBrowserRouter } from 'react-router-dom';

import { App } from '../App';
import { Layout } from '../Layout';
import { RequireAuth } from './RequireAuth';

import {
  Dashboard,
  Home,
  NotFound,
  SignIn,
  SignOut,
  SignUp,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: '/dashboard',
                element: <Dashboard />,
              },
            ],
          },
        ],
      },
      { path: '/', element: <Home /> },
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
      { path: '/sign-out', element: <SignOut /> },
      { path: '/not-found', element: <NotFound /> },
      { path: '/:code', element: <Home /> },
      { path: '*', element: <Navigate replace to='/not-found' /> },
    ],
  },
]);
