import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MyQuizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchMyQuizzes();
    }
  }, [user]);

  const fetchMyQuizzes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/quizzes`);
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.quiz_type === filter;
  });

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

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quiz của tôi</h1>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Tất cả ({quizzes.length})
          </button>
          <button
            onClick={() => setFilter('iq')}
            className={`px-4 py-2 rounded ${filter === 'iq' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            IQ Quiz ({quizzes.filter(q => q.quiz_type === 'iq').length})
          </button>
          <button
            onClick={() => setFilter('personality')}
            className={`px-4 py-2 rounded ${filter === 'personality' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Personality Quiz ({quizzes.filter(q => q.quiz_type === 'personality').length})
          </button>
        </div>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{quiz.quiz_title}</h3>
              <p className="text-gray-600 mb-3">{quiz.quiz_category}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Loại:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    quiz.quiz_type === 'iq' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {quiz.quiz_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kết quả:</span>
                  <span className="font-medium">{formatResult(quiz.result)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày làm:</span>
                  <span>{new Date(quiz.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <Link
                to={`/quiz/${quiz.quiz_id}`}
                className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Làm lại
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Bạn chưa làm quiz nào</div>
          <Link
            to="/categories"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Khám phá Quiz
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
