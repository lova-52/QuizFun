import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  console.log('ProtectedRoute - user:', user, 'Location:', location.pathname); // Debug chi tiết

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <div className="text-red-500 text-center py-4">Bạn không có quyền truy cập</div>;
  }

  return children;
};

export default ProtectedRoute;