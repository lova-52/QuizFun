import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();

  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập (giả định /login)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin, hiển thị lỗi
  if (requireAdmin && user.role !== 'admin') {
    return <div className="text-red-500 text-center py-4">Bạn không có quyền truy cập</div>;
  }

  return children;
};

export default ProtectedRoute;