import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/auth/AuthPage';
import { PrivateRoute, PublicRoute } from '@/components/auth/RouteGuard';
import { ChatListPage } from '@/pages/chat/ChatListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <ChatListPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        ),
      },
      {
        path: '',
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
]);