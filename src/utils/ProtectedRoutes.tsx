import { Navigate } from 'react-router';
import { useAuth } from '../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <></>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
