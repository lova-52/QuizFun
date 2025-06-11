import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // Lấy user và openLogin từ AuthContext
  const { user, openLogin } = useContext(AuthContext);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  

  // Fetch quiz details từ API
  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log('API response:', result);

        if (result.success && result.data) {
          setQuiz(result.data);
        } else {
          throw new Error('Không thể lấy dữ liệu quiz');
        }
      } catch (err) {
        console.error('Lỗi khi fetch quiz:', err);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quizId]);

  const handleStartQuiz = () => {
    // Kiểm tra đăng nhập
    if (!user) {
      openLogin(); 
      return;
    }
    setShowStartModal(true);
  };

  const confirmStartQuiz = () => {
    navigate(`/quiz/${quizId}/take`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy quiz này</h2>
            <p className="mt-2 text-gray-600">Quiz bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="mt-6 inline-block bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${quiz.categoryId}`} className="hover:text-primary">{quiz.categoryName}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{quiz.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img className="w-full h-full object-cover" src={quiz.image} alt={quiz.title} />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{quiz.title}</h1>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{quiz.completions.toLocaleString()} lượt làm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin quiz</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số câu hỏi:</span>
                  <span className="font-semibold">{quiz.questionCount} câu</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold">{quiz.time.toLocaleString()} phút </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-primary hover:bg-darkPrimary text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bắt đầu làm bài
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Quiz Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-10 mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bắt đầu làm bài?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn sẽ hoàn thành {quiz.questionCount} câu hỏi.
                Hãy đảm bảo bạn đã sẵn sàng trước khi bắt đầu.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmStartQuiz}
                  className="flex-1 bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Bắt đầu ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizDetail;