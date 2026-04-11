import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPage?: string; // optional specific page key to check
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiresPage }) => {
  const { isAuthenticated, hasPageAccess } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific page key is required, check access
  const pathToCheck = requiresPage ?? location.pathname;
  if (!hasPageAccess(pathToCheck)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;