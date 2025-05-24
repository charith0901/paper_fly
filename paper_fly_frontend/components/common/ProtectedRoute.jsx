import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../../services/authService';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const user = getCurrentUser();
  
  if (!user) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    // User is not an admin but the route requires admin access
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated (and is admin if required), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
