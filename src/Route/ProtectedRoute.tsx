import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react';

interface AuthRouteProps {
  children: JSX.Element;
  requireAuth: boolean; // true - только для авторизованных, false - только для гостей
}

const ProtectedRoute = ({ children, requireAuth }: AuthRouteProps) => {
  const location = useLocation();
  const tokenStr = localStorage.getItem("token");

  // Если требуется авторизация, но пользователь не авторизован
  if (requireAuth && !tokenStr) {
    return <Navigate to="/authorization" state={{ from: location }} replace />;
  }

  // Если только для гостей, но пользователь авторизован
  if (!requireAuth && tokenStr) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;