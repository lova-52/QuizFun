import React, { useState, useEffect } from 'react';

const UserStatisticsModal = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserStatistics();
    }
  }, [userId]);

  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/statistics`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatResult = (result) => {
    if (!result) return 'Chưa hoàn thành';
    
    try {
      const parsed = typeof result === 'string' ? JSON.parse(result) : result;
      if (parsed.score !== undefined) {
        return `${parsed.score}%`;
      }
      return result;
    } catch {
      return result;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Thống kê User</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium mb-3">Thông tin User</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Tên:</span>
                <span className="ml-2 font-medium">{data.user.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{data.user.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Vai trò:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  data.user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {data.user.role}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Ngày tham gia:</span>
                <span className="ml-2 font-medium">{formatDate(data.user.joinedAt)}</span>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data.statistics.totalQuizzes}</div>
              <div className="text-sm text-blue-800">Tổng quiz đã chơi</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{data.statistics.completedQuizzes}</div>
              <div className="text-sm text-green-800">Quiz hoàn thành</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{data.statistics.totalTimeSpent}</div>
              <div className="text-sm text-purple-800">Phút đã chơi</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{data.statistics.avgTimePerQuiz}</div>
              <div className="text-sm text-orange-800">Phút/quiz trung bình</div>
            </div>
          </div>

          {/* Quiz Types */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium mb-3">Loại Quiz</h4>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>IQ Quiz: {data.statistics.quizTypes.iq || 0}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
                <span>Personality Quiz: {data.statistics.quizTypes.personality || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Quizzes */}
          <div>
            <h4 className="text-lg font-medium mb-3">Quiz gần đây</h4>
            {data.recentQuizzes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Quiz</th>
                      <th className="px-3 py-2 text-left">Danh mục</th>
                      <th className="px-3 py-2 text-left">Loại</th>
                      <th className="px-3 py-2 text-left">Kết quả</th>
                      
                      <th className="px-3 py-2 text-left">Ngày chơi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentQuizzes.map((quiz, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="font-medium">{quiz.quizTitle}</div>
                        </td>
                        <td className="px-3 py-2">{quiz.quizCategory}</td>
                        <td className="px-3 py-2 capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            quiz.quizType === 'iq' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {quiz.quizType}
                          </span>
                        </td>
                        <td className="px-3 py-2">{formatResult(quiz.result)}</td>
                        
                        <td className="px-3 py-2">{formatDate(quiz.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                User này chưa chơi quiz nào
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatisticsModal;
