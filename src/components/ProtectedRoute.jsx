import React from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = "/", 
  requireQuizResult = false 
}) => {
  const { user } = useAuth();
  const { quizId } = useParams();
  const location = useLocation();

  // Nếu chưa đăng nhập
  if (!user) {
    // Nếu redirectTo có :quizId, thay thế bằng quizId thực tế
    const finalRedirectTo = redirectTo.includes(':quizId') && quizId 
      ? redirectTo.replace(':quizId', quizId)
      : redirectTo;
    
    return <Navigate to={finalRedirectTo} replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user.role !== 'admin') {
    return <div className="text-red-500 text-center py-4">Bạn không có quyền truy cập</div>;
  }

  // Nếu yêu cầu có kết quả quiz (cho trang result)
  if (requireQuizResult) {
    // Kiểm tra xem có dữ liệu kết quả trong location.state không
    const hasResultData = location.state && (
      location.state.score !== undefined || 
      location.state.personalityType || 
      location.state.detailedResults
    );

    if (!hasResultData) {
      // Chuyển về trang chi tiết quiz
      const finalRedirectTo = redirectTo.includes(':quizId') && quizId 
        ? redirectTo.replace(':quizId', quizId)
        : redirectTo;
      
      return <Navigate to={finalRedirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;