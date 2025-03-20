import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};