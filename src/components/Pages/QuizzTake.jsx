import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Home/Navbar/Navbar';
import Footer from '../Home/Footer/Footer';

function QuizzTake() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, token, openLogin } = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    // Kiểm tra localStorage để khôi phục trạng thái ngay lập tức
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      // Nếu đã có user và token trong localStorage, đánh dấu đã kiểm tra
      setIsAuthChecked(true);
    } else if (user === null && token === null) {
      // Nếu không có user/token và đã kiểm tra, yêu cầu đăng nhập
      openLogin();
      navigate('/', { state: { from: `/quiz/${quizId}/take` } });
    }
  }, [user, token, openLogin, navigate, quizId]);

  // Add beforeunload event listener to warn about unsaved data
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (Object.keys(answers).length > 0 || timeLeft > 0) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers, timeLeft]);

  // Fetch quiz data và questions từ API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/questions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Bạn cần đăng nhập để truy cập bài quiz');
          }
          throw new Error('Không thể tải dữ liệu quiz');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Lỗi khi tải quiz');
        }

        const { quiz: quizInfo, questions: questionsData } = data.data;

        setQuiz(quizInfo);
        setQuestions(questionsData);

        const timeInSeconds = (quizInfo.timeLimit || 15) * 60;
        setTimeLeft(timeInSeconds);

      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (quizId && user && token && isAuthChecked) {
      fetchQuizData();
    }
  }, [quizId, user, token, isAuthChecked]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !loading && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft, loading, questions.length]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerId, isMultiChoice = false) => {
    setAnswers(prev => {
      if (isMultiChoice) {
        const currentAnswers = prev[questionId] || [];
        const isSelected = currentAnswers.includes(answerId);

        if (isSelected) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(id => id !== answerId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId]
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [answerId]
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // ← SỬA: Thêm chi tiết câu hỏi và đáp án để gửi lên server
      const submitData = {
        answers: Object.keys(answers).map(questionId => {
          const question = questions.find(q => q.id === parseInt(questionId));
          const selectedAnswerIds = answers[questionId] || [];
          
          return {
            questionId: parseInt(questionId),
            selectedAnswers: selectedAnswerIds,
            // ← THÊM: Chi tiết câu hỏi để hiển thị trong kết quả
            questionContent: question?.question || '',
            questionOptions: question?.answers || [],
            selectedAnswerTexts: selectedAnswerIds.map(answerId => 
              question?.answers?.find(opt => opt.id === answerId)?.content || ''
            )
          };
        }),
        timeSpent: (quiz.timeLimit * 60) - timeLeft,
        userId: user ? user.id : null,
        // ← THÊM: Thông tin quiz để xử lý kết quả
        quizType: quiz.quiz_type || quiz.type,
        totalQuestions: questions.length
      };

      console.log('Submit data:', submitData); // Debug

      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('Submit response:', result);

      if (result.success) {
        navigate(`/quiz/${quizId}/result`, {
          state: {
            ...result.data,
            quizTitle: quiz.title,
            // ← THÊM: Chi tiết câu hỏi để hiển thị trong QuizResult
            detailedResults: result.data.detailedResults || [],
            quizType: quiz.quiz_type || quiz.type
          }
        });
      } else {
        console.error('Submit failed:', result.message);
        
        // ← SỬA: Fallback với chi tiết câu hỏi
        const fallbackDetailedResults = Object.keys(answers).map(questionId => {
          const question = questions.find(q => q.id === parseInt(questionId));
          const selectedAnswerIds = answers[questionId] || [];
          const selectedAnswer = question?.answers?.find(opt => selectedAnswerIds.includes(opt.id));
          const correctAnswer = question?.answers?.find(opt => opt.is_correct);
          
          return {
            questionId: parseInt(questionId),
            questionContent: question?.question || '',
            selectedAnswer: selectedAnswer?.content || 'Không chọn',
            correctAnswer: correctAnswer?.content || 'N/A',
            isCorrect: selectedAnswer?.is_correct || false,
            options: question?.answers || []
          };
        });

        const totalAnswered = Object.keys(answers).length;
        const completionRate = (totalAnswered / questions.length) * 100;

        navigate(`/quiz/${quizId}/result`, {
          state: {
            answers,
            totalQuestions: questions.length,
            completionRate,
            timeSpent: (quiz.timeLimit * 60) - timeLeft,
            quizTitle: quiz.title,
            quizType: quiz.quiz_type || quiz.type,
            score: 0, // Default fallback
            detailedResults: fallbackDetailedResults // ← THÊM chi tiết fallback
          }
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // ← SỬA: Fallback với chi tiết câu hỏi khi có lỗi
      const fallbackDetailedResults = Object.keys(answers).map(questionId => {
        const question = questions.find(q => q.id === parseInt(questionId));
        const selectedAnswerIds = answers[questionId] || [];
        const selectedAnswer = question?.answers?.find(opt => selectedAnswerIds.includes(opt.id));
        const correctAnswer = question?.answers?.find(opt => opt.is_correct);
        
        return {
          questionId: parseInt(questionId),
          questionContent: question?.question || '',
          selectedAnswer: selectedAnswer?.content || 'Không chọn',
          correctAnswer: correctAnswer?.content || 'N/A',
          isCorrect: selectedAnswer?.is_correct || false,
          options: question?.answers || []
        };
      });

      const totalAnswered = Object.keys(answers).length;
      const completionRate = (totalAnswered / questions.length) * 100;

      navigate(`/quiz/${quizId}/result`, {
        state: {
          answers,
          totalQuestions: questions.length,
          completionRate,
          timeSpent: (quiz.timeLimit * 60) - timeLeft,
          quizTitle: quiz.title,
          quizType: quiz.quiz_type || quiz.type,
          score: 0, // Default fallback
          detailedResults: fallbackDetailedResults // ← THÊM chi tiết fallback
        }
      });
    }
  };

  const handleExit = () => {
    navigate(`/quiz/${quizId}`);
  };

  const getProgress = () => {
    return questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(questionId => {
      const answer = answers[questionId];
      return answer && answer.length > 0;
    }).length;
  };

  const isAnswerSelected = (questionId, answerId) => {
    const selectedAnswers = answers[questionId] || [];
    return selectedAnswers.includes(answerId);
  };

  // Hiển thị loading trong khi kiểm tra xác thực
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị yêu cầu đăng nhập nếu chưa đăng nhập
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Vui lòng đăng nhập để tiếp tục...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.71 0L3.104 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-darkPrimary text-white px-6 py-2 rounded-lg"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !questions.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy câu hỏi</h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-primary hover:bg-darkPrimary text-white px-6 py-2 rounded-lg"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isMultiChoice = currentQ.type === 'multi_choice';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header với timer và progress */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => setShowExitModal(true)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-base md:text-lg font-semibold text-gray-800 truncate">{quiz.title}</h1>
            </div>

            <div className="flex items-center space-x-2 md:space-x-6 flex-shrink-0">
              <div className="text-xs md:text-sm text-gray-600">
                <span className="font-medium">{getAnsweredCount()}</span>/{questions.length}
                <span className="hidden sm:inline"> câu</span>
              </div>
              <div className={`text-xs md:text-sm font-medium ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                <span className="hidden sm:inline">⏱️ </span>{formatTime(timeLeft)}
              </div>
              {/* Nút nộp bài trong header */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors text-xs md:text-sm"
              >
                Nộp bài
              </button>
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

      {/* Main content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 max-w-7xl">
        {/* Khung điều hướng - Đặt ở trên cho màn hình nhỏ */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Điều hướng câu hỏi</h3>
              <div className="text-xs text-gray-600">
                Đã trả lời: <span className="font-medium">{getAnsweredCount()}/{questions.length}</span>
              </div>
            </div>
            
            {/* Grid layout cho điều hướng trên mobile */}
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg font-medium text-xs transition-colors ${
                    index === currentQuestion
                      ? 'bg-primary text-white'
                      : answers[question.id] && answers[question.id].length > 0
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

        <div className="flex gap-2 sm:gap-4 lg:gap-6">
          {/* Sidebar - Chỉ hiển thị trên desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Điều hướng câu hỏi</h3>

              {/* Desktop: Grid layout */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-12 h-10 rounded-lg font-medium text-sm transition-colors ${
                      index === currentQuestion
                        ? 'bg-primary text-white'
                        : answers[question.id] && answers[question.id].length > 0
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Đã trả lời:</span>
                    <span className="font-medium">{getAnsweredCount()}/{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Còn lại:</span>
                    <span className="font-medium">{questions.length - getAnsweredCount()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content chính */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-md">
              {/* Question header */}
              <div className="p-4 md:p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <span className="text-sm font-medium text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full w-fit">
                    Câu hỏi {currentQuestion + 1}/{questions.length}
                  </span>
                  {isMultiChoice && (
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full w-fit">
                      Chọn nhiều đáp án
                    </span>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                  {currentQ.question}
                </h2>

                {/* Hiển thị ảnh câu hỏi nếu có */}
                {currentQ.questionImage && (
                  <div className="mt-4 text-center">
                    <img
                      src={currentQ.questionImage}
                      alt="Hình ảnh câu hỏi"
                      className="inline-block w-full max-w-md h-auto rounded-lg shadow-md border border-gray-200"
                      style={{ maxHeight: '300px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.log('Lỗi tải ảnh câu hỏi:', currentQ.questionImage);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Answer options */}
              <div className="p-4 md:p-6">
                <div className="space-y-3">
                  {currentQ.answers.map((answer) => (
                    <button
                      key={answer.id}
                      onClick={() => handleAnswerSelect(currentQ.id, answer.id, isMultiChoice)}
                      className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all ${
                        isAnswerSelected(currentQ.id, answer.id)
                          ? 'border-primary bg-primary bg-opacity-5 text-primary'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                          isMultiChoice
                            ? `rounded border-2 ${
                                isAnswerSelected(currentQ.id, answer.id)
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`
                            : `rounded-full border-2 ${
                                isAnswerSelected(currentQ.id, answer.id)
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`
                        }`}>
                          {isAnswerSelected(currentQ.id, answer.id) && (
                            isMultiChoice ? (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )
                          )}
                        </div>
                        <span className="text-gray-700 text-sm md:text-base leading-relaxed">{answer.content}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation - Chỉ có nút Previous và Next */}
              <div className="p-4 md:p-6 border-t bg-gray-50 rounded-b-xl">
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

                  {currentQuestion < questions.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="bg-primary hover:bg-darkPrimary text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
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
                Bạn đã trả lời {getAnsweredCount()}/{questions.length} câu hỏi.
                {getAnsweredCount() < questions.length && ' Các câu chưa trả lời sẽ được tính là sai.'}
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
    </div>
  );
}

export default QuizzTake;
