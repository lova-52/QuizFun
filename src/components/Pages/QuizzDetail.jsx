import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Điều chỉnh đường dẫn
import Navbar from '../Home/Navbar/Navbar';
import Footer from '../Home/Footer/Footer';
import LoginModal from '../../components/Auth/LoginModal'; // Điều chỉnh đường dẫn

function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
  }, [quizId]);

  const handleStartQuiz = () => {
    // Kiểm tra đăng nhập
    if (!user) {
      setShowLoginModal(true);
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
                  <span className="text-gray-600">Lượt làm:</span>
                  <span className="font-semibold">{quiz.completions.toLocaleString()} </span>
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
                
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Lưu vào yêu thích
                </button>
                
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Chia sẻ
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

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}

export default QuizDetail;