import React, { useEffect, useState } from 'react';
import AddQuizModal from './AddQuizModal';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/admin/quizzes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuizzes(data.data);
        } else {
          setError('Có lỗi xảy ra khi lấy danh sách quiz');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi kết nối đến server');
        setLoading(false);
      });
  };

  const handleDelete = async (quizId, quizTitle) => {
    if (window.confirm(`Bạn có chắc muốn xóa quiz "${quizTitle}"? Hành động này không thể hoàn tác.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/quizzes/${quizId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
          setError(null);
        } else {
          setError(data.message || 'Xóa quiz thất bại');
        }
      } catch (err) {
        setError('Lỗi khi kết nối đến server');
      }
    }
  };

  const handleAddQuiz = (newQuiz) => {
    fetchQuizzes(); // Refresh danh sách
    setShowAddModal(false);
  };

  if (loading) return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Quiz</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Thêm Quiz Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Tiêu đề</th>
              <th className="px-4 py-2">Danh mục</th>
              <th className="px-4 py-2">Số câu hỏi</th>
              <th className="px-4 py-2">Lượt chơi</th>
              <th className="px-4 py-2">Loại quiz</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {quiz.description}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">{quiz.categoryName}</td>
                <td className="px-4 py-2">{quiz.totalQuestions}</td>
                <td className="px-4 py-2">{quiz.playCount}</td>
                <td className="px-4 py-2 capitalize">{quiz.quizType}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:text-blue-700 mr-4">
                    Sửa
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(quiz.id, quiz.title)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có quiz nào. Hãy thêm quiz đầu tiên!
        </div>
      )}

      {showAddModal && (
        <AddQuizModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddQuiz}
        />
      )}
    </div>
  );
};

export default QuizManagement;
