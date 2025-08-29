import { Navigate } from 'react-router';
import { useAuth } from '../hooks';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/' }: PublicRouteProps) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <></>;

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};
