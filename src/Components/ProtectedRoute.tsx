import React from "react";
import { Navigate } from "react-router-dom";
import Authentication from "../Service/Auth/Authentication";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = Authentication.isAuthenticated();
  const userRole = Authentication.extractRoleFromToken();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
