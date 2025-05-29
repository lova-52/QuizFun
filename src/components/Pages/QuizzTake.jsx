import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Home/Navbar/Navbar';
import Footer from '../Home/Footer/Footer';

function QuizzTake() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút = 900 giây
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Mock data cho câu hỏi
  useEffect(() => {
    const mockQuiz = {
      id: quizId,
      title: 'Bạn thuộc nhóm tính cách nào?',
      questions: [
        {
          id: 1,
          question: 'Khi tham gia một bữa tiệc, bạn thường:',
          type: 'single',
          options: [
            'Chủ động làm quen với nhiều người mới',
            'Chỉ nói chuyện với một vài người quen',
            'Tìm góc yên tĩnh để quan sát',
            'Rời đi sớm vì cảm thấy mệt mỏi'
          ]
        },
        {
          id: 2,
          question: 'Bạn thích học hỏi thông qua:',
          type: 'single',
          options: [
            'Đọc sách và tài liệu',
            'Thực hành trực tiếp',
            'Thảo luận với người khác',
            'Xem video và hình ảnh'
          ]
        },
        {
          id: 3,
          question: 'Khi đưa ra quyết định quan trọng, bạn thường:',
          type: 'single',
          options: [
            'Phân tích logic và dữ liệu',
            'Tin vào cảm giác và trực giác',
            'Tham khảo ý kiến người khác',
            'Cân nhắc tác động đến mọi người'
          ]
        },
        {
          id: 4,
          question: 'Môi trường làm việc lý tưởng của bạn là:',
          type: 'single',
          options: [
            'Có kế hoạch rõ ràng và deadline cụ thể',
            'Linh hoạt và có thể thay đổi',
            'Làm việc độc lập',
            'Làm việc nhóm và hợp tác'
          ]
        },
        {
          id: 5,
          question: 'Khi gặp căng thẳng, bạn thường:',
          type: 'single',
          options: [
            'Tìm cách giải quyết ngay lập tức',
            'Cần thời gian một mình để suy nghĩ',
            'Tìm người để chia sẻ và tâm sự',
            'Làm những việc khác để xao nhãng'
          ]
        },
        {
          id: 6,
          question: 'Trong công việc, bạn thích:',
          type: 'single',
          options: [
            'Tập trung vào chi tiết và độ chính xác',
            'Nhìn tổng thể và ý tưởng lớn',
            'Giải quyết vấn đề cụ thể',
            'Sáng tạo và đổi mới'
          ]
        },
        {
          id: 7,
          question: 'Khi nhận phản hồi, bạn:',
          type: 'single',
          options: [
            'Đánh giá tính logic của lời phản hồi',
            'Quan tâm đến cách thức đưa ra phản hồi',
            'Tập trung vào nội dung cải thiện',
            'Cảm thấy tổn thương nếu phản hồi tiêu cực'
          ]
        },
        {
          id: 8,
          question: 'Bạn thích lập kế hoạch:',
          type: 'single',
          options: [
            'Chi tiết từ trước và tuân thủ nghiêm ngặt',
            'Khung tổng quát và điều chỉnh linh hoạt',
            'Chỉ lập kế hoạch khi cần thiết',
            'Thích ứng theo tình huống'
          ]
        },
        {
          id: 9,
          question: 'Khi học một kỹ năng mới, bạn:',
          type: 'single',
          options: [
            'Đọc hướng dẫn kỹ càng trước',
            'Thử nghiệm và khám phá ngay',
            'Tìm người hướng dẫn trực tiếp',
            'Tham gia khóa học có cấu trúc'
          ]
        },
        {
          id: 10,
          question: 'Trong cuộc sống hàng ngày, bạn:',
          type: 'single',
          options: [
            'Thích thói quen ổn định',
            'Thích sự đa dạng và thay đổi',
            'Cân bằng giữa ổn định và mới mẻ',
            'Tùy thuộc vào tâm trạng'
          ]
        },
        {
          id: 11,
          question: 'Khi giao tiếp, bạn thường:',
          type: 'single',
          options: [
            'Trực tiếp và súc tích',
            'Tỉ mỉ và chi tiết',
            'Ấm áp và thân thiện',
            'Lắng nghe nhiều hơn nói'
          ]
        },
        {
          id: 12,
          question: 'Bạn cảm thấy thoải mái nhất khi:',
          type: 'single',
          options: [
            'Mọi thứ được sắp xếp có trật tự',
            'Có nhiều lựa chọn và khả năng',
            'Được làm việc với con người',
            'Có thời gian riêng để suy ngẫm'
          ]
        },
        {
          id: 13,
          question: 'Khi giải quyết xung đột, bạn:',
          type: 'single',
          options: [
            'Tập trung vào sự thật và logic',
            'Quan tâm đến cảm xúc của mọi người',
            'Tìm cách thỏa hiệp',
            'Tránh xung đột nếu có thể'
          ]
        },
        {
          id: 14,
          question: 'Cuối tuần lý tưởng của bạn là:',
          type: 'single',
          options: [
            'Tham gia hoạt động xã hội',
            'Thư giãn tại nhà một mình',
            'Khám phá địa điểm mới',
            'Dành thời gian với gia đình'
          ]
        },
        {
          id: 15,
          question: 'Khi đưa ra ý tưởng mới, bạn:',
          type: 'single',
          options: [
            'Nghĩ về tính khả thi ngay',
            'Để tưởng tượng bay bổng trước',
            'Thảo luận với người khác',
            'Ghi chép và phân tích kỹ'
          ]
        },
        {
          id: 16,
          question: 'Bạn thích làm việc:',
          type: 'single',
          options: [
            'Theo deadline rõ ràng',
            'Không áp lực thời gian',
            'Với sự hỗ trợ từ đồng nghiệp',
            'Độc lập và tự chủ'
          ]
        },
        {
          id: 17,
          question: 'Khi phải thuyết trình, bạn:',
          type: 'single',
          options: [
            'Chuẩn bị kỹ càng từ trước',
            'Tin vào khả năng ứng biến',
            'Lo lắng về phản ứng của khán giả',
            'Hào hứng chia sẻ ý tưởng'
          ]
        },
        {
          id: 18,
          question: 'Bạn thích đọc:',
          type: 'single',
          options: [
            'Sách phi hư cấu và học thuật',
            'Tiểu thuyết và truyện ngắn',
            'Sách phát triển bản thân',
            'Tin tức và thông tin thời sự'
          ]
        },
        {
          id: 19,
          question: 'Trong nhóm, bạn thường:',
          type: 'single',
          options: [
            'Đảm nhận vai trò lãnh đạo',
            'Đóng góp ý tưởng sáng tạo',
            'Hỗ trợ và động viên thành viên',
            'Tập trung vào nhiệm vụ cụ thể'
          ]
        },
        {
          id: 20,
          question: 'Khi hoàn thành một dự án, bạn:',
          type: 'single',
          options: [
            'Đánh giá kết quả một cách khách quan',
            'Cảm thấy hài lòng với quá trình',
            'Chia sẻ thành công với người khác',
            'Ngay lập tức nghĩ đến dự án tiếp theo'
          ]
        }
      ]
    };

    setTimeout(() => {
      setQuiz(mockQuiz);
      setLoading(false);
    }, 1000);
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Tính toán kết quả (đây là logic đơn giản, bạn có thể customize)
    const totalAnswered = Object.keys(answers).length;
    const completionRate = (totalAnswered / quiz.questions.length) * 100;
    
    // Chuyển đến trang kết quả
    navigate(`/quiz/${quizId}/result`, { 
      state: { 
        answers, 
        totalQuestions: quiz.questions.length,
        completionRate,
        timeSpent: 900 - timeLeft
      } 
    });
  };

  const handleExit = () => {
    navigate(`/quiz/${quizId}`);
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
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
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy bài quiz</h2>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-primary hover:bg-darkPrimary text-white px-6 py-2 rounded-lg"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header với timer và progress */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowExitModal(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 truncate">{quiz.title}</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{getAnsweredCount()}</span>/{quiz.questions.length} câu
              </div>
              <div className={`text-sm font-medium ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content với sidebar */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Sidebar điều hướng câu hỏi */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Điều hướng câu hỏi</h3>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-12 h-10 rounded-lg font-medium text-sm transition-colors ${
                      index === currentQuestion
                        ? 'bg-primary text-white'
                        : answers[quiz.questions[index].id] !== undefined
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content chính */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md">
              {/* Question header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full">
                    Câu hỏi {currentQuestion + 1}/{quiz.questions.length}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              {/* Answer options */}
              <div className="p-6">
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQ.id] === index
                          ? 'border-primary bg-primary bg-opacity-5 text-primary'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQ.id] === index
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQ.id] === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="p-6 border-t bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentQuestion === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Câu trước
                  </button>

                  <div className="flex items-center space-x-3">
                    {currentQuestion === quiz.questions.length - 1 ? (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Nộp bài
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="bg-primary hover:bg-darkPrimary text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
                      >
                        Câu tiếp
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nộp bài làm?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Bạn đã trả lời {getAnsweredCount()}/{quiz.questions.length} câu hỏi.
                {getAnsweredCount() < quiz.questions.length && ' Các câu chưa trả lời sẽ được tính là sai.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Tiếp tục làm
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.71 0L3.104 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thoát bài làm?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Nếu thoát bây giờ, tất cả câu trả lời của bạn sẽ bị mất. Bạn có chắc chắn muốn thoát?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Tiếp tục làm
                </button>
                <button
                  onClick={handleExit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Thoát
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

export default QuizzTake;