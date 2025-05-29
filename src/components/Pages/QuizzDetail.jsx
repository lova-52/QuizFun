import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../Home/Navbar/Navbar';
import Footer from '../Home/Footer/Footer';

function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);

  // Mock data
  useEffect(() => {
    const mockQuizzes = [
      {
        id: '1',
        categoryId: '1',
        categoryName: 'Tính cách',
        title: 'Bạn thuộc nhóm tính cách nào?',
        description: 'Khám phá bạn thuộc nhóm tính cách MBTI nào qua 20 câu hỏi đơn giản',
        detailedDescription: 'Bài test này sẽ giúp bạn hiểu rõ hơn về tính cách của mình thông qua hệ thống phân loại Myers-Briggs Type Indicator (MBTI). Với 20 câu hỏi được thiết kế cẩn thận, bạn sẽ khám phá ra mình thuộc một trong 16 loại tính cách khác nhau, từ đó hiểu được điểm mạnh, điểm yếu và cách tương tác với thế giới xung quanh.',
        image: 'https://www.verywellmind.com/thmb/uwCfX7jYs3W2U5lc6S5vJ25XPCY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2795284-00-MBTI-typing-system-and-the-types_V1-c7d2798146ae4f2cbe0fb767118eb89e.jpg',
        difficulty: 'Dễ',
        questionCount: 20,
        estimatedTime: '10-15 phút',
        completions: 15240,
        rating: 4.8,
        reviewCount: 1840,
        tags: ['MBTI', 'Tâm lý học', 'Tự nhận thức', 'Tính cách'],
        objectives: [
          'Xác định loại tính cách MBTI của bạn',
          'Hiểu được điểm mạnh và điểm yếu của bản thân',
          'Khám phá cách bạn tương tác với người khác',
          'Tìm hiểu môi trường làm việc phù hợp'
        ],
        whatYouWillLearn: [
          'Bạn là người hướng nội hay hướng ngoại',
          'Cách bạn tiếp nhận và xử lý thông tin',
          'Phong cách ra quyết định của bạn',
          'Cách bạn tổ chức cuộc sống hàng ngày'
        ],
        requirements: [
          'Trả lời các câu hỏi một cách trung thực',
          'Dành 10-15 phút để hoàn thành',
          'Không cần kiến thức chuyên môn'
        ],
        createdAt: '2023-09-15',
        author: 'Dr. Sarah Johnson',
        authorBio: 'Tiến sĩ Tâm lý học với 15 năm kinh nghiệm nghiên cứu về tính cách con người'
      },
      {
        id: '2',
        categoryId: '1',
        categoryName: 'Tính cách',
        title: 'Phong cách làm việc của bạn',
        description: 'Tìm hiểu phong cách làm việc và cách phối hợp với đồng nghiệp hiệu quả',
        detailedDescription: 'Khám phá phong cách làm việc độc đáo của bạn và cách tối ưu hóa hiệu suất trong môi trường làm việc. Bài test này sẽ giúp bạn hiểu được cách bạn tiếp cận công việc, tương tác với đồng nghiệp và quản lý thời gian.',
        image: 'https://www.ntaskmanager.com/wp-content/uploads/2019/07/3.png',
        difficulty: 'Trung bình',
        questionCount: 15,
        estimatedTime: '8-12 phút',
        completions: 8920,
        rating: 4.6,
        reviewCount: 920,
        tags: ['Làm việc', 'Quản lý thời gian', 'Teamwork', 'Hiệu suất'],
        objectives: [
          'Xác định phong cách làm việc của bạn',
          'Cải thiện hiệu suất công việc',
          'Tăng cường khả năng làm việc nhóm',
          'Quản lý thời gian hiệu quả hơn'
        ],
        whatYouWillLearn: [
          'Cách bạn tiếp cận các dự án mới',
          'Phong cách giao tiếp trong công việc',
          'Cách bạn xử lý áp lực và deadline',
          'Môi trường làm việc lý tưởng cho bạn'
        ],
        requirements: [
          'Có kinh nghiệm làm việc tối thiểu 6 tháng',
          'Trả lời dựa trên kinh nghiệm thực tế',
          'Hoàn thành trong môi trường yên tĩnh'
        ],
        createdAt: '2023-10-02',
        author: 'Prof. Michael Chen',
        authorBio: 'Chuyên gia tư vấn quản lý nhân sự với hơn 20 năm kinh nghiệm'
      }
    ];

    setTimeout(() => {
      const foundQuiz = mockQuizzes.find(q => q.id === quizId);
      setQuiz(foundQuiz);
      setLoading(false);
    }, 800);
  }, [quizId]);

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Dễ': return 'bg-green-100 text-green-800 border-green-200';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Khó': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleStartQuiz = () => {
    setShowStartModal(true);
  };

  const confirmStartQuiz = () => {
    navigate(`/quiz/${quizId}/take`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-7xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin quiz...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy quiz này</h2>
            <p className="mt-2 text-gray-600">Quiz bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="mt-6 inline-block bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Quay về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.tags.map(tag => (
                    <span key={tag} className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">{quiz.title}</h1>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{quiz.rating}/5 ({quiz.reviewCount} đánh giá)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>{quiz.completions.toLocaleString()} người đã làm</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{quiz.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
              <p className="text-gray-600 leading-relaxed">{quiz.detailedDescription}</p>
            </div>

            {/* What You Will Learn */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bạn sẽ học được gì?</h2>
              <ul className="space-y-3">
                {quiz.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tác giả</h2>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {quiz.author.split(' ').map(name => name[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{quiz.author}</h3>
                  <p className="text-gray-600 text-sm">{quiz.authorBio}</p>
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
                  <span className="font-semibold">{quiz.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ khó:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đánh giá:</span>
                  <span className="font-semibold">{quiz.rating}/5 ⭐</span>
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

              {/* Requirements */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">Yêu cầu</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {quiz.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objectives */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">Mục tiêu</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {quiz.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {obj}
                    </li>
                  ))}
                </ul>
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
                Bạn sẽ có {quiz.estimatedTime} để hoàn thành {quiz.questionCount} câu hỏi. 
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

      <Footer />
    </div>
  );
}

export default QuizDetail;