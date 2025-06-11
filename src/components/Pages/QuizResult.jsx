import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Thêm state cho email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  console.log("=== DEBUG QUIZ RESULT ===");
  console.log("location.state:", location.state);

  // Destructure dữ liệu từ location.state
  const {
    totalQuestions = 0,
    completionRate = 100,
    timeSpent = 0,
    personalityType = 'balanced',
    score = 0,
    quizType = 'iq',
    quizTitle = 'Quiz',
    correctAnswers = 0,
    detailedResults = [],
    isPersonalityQuiz = false
  } = location.state || {};

  console.log("=== RENDER DEBUG ===");
  console.log("quizType:", quizType);
  console.log("isPersonalityQuiz:", isPersonalityQuiz);
  console.log("personalityType:", personalityType);
  console.log("score:", score);

  useEffect(() => {
    // Mock data quiz
    const mockQuiz = {
      id: quizId,
      title: quizTitle,
      questions: []
    };

    // Logic chính để tính toán kết quả
    const calculateResult = () => {
      console.log("calculateResult - quizType:", quizType);
      console.log("calculateResult - personalityType:", personalityType);

      if (quizType === "personality" || isPersonalityQuiz) {
        return calculatePersonalityResult();
      } else if (quizType === "iq") {
        return calculateIQResult();
      }
      return null;
    };

    const calculateIQResult = () => {
      if (score === undefined || totalQuestions === undefined) return null;

      return {
        personalityType: {
          label: "IQ Quiz",
          description: `Bạn đã trả lời đúng ${correctAnswers || Math.round((score / 100) * totalQuestions)} / ${totalQuestions} câu hỏi.`,
        },
        score: score,
        correctAnswers: correctAnswers || Math.round((score / 100) * totalQuestions),
        wrongAnswers: totalQuestions - (correctAnswers || Math.round((score / 100) * totalQuestions)),
        breakdown: {},
      };
    };

    const calculatePersonalityResult = () => {
      console.log("Calculating personality result for:", personalityType);

      const personalityTypes = {
        extrovert: {
          label: 'Hướng ngoại',
          description: 'Bạn là người năng động, thích giao tiếp và làm việc với nhiều người.',
          key: 'extrovert'
        },
        introvert: {
          label: 'Hướng nội',
          description: 'Bạn là người thích suy ngẫm, làm việc độc lập và cần thời gian riêng.',
          key: 'introvert'
        },
        thinking: {
          label: 'Lý trí',
          description: 'Bạn đưa ra quyết định dựa trên logic và phân tích khách quan.',
          key: 'thinking'
        },
        feeling: {
          label: 'Cảm xúc',
          description: 'Bạn quyết định dựa trên cảm xúc và tác động đến con người.',
          key: 'feeling'
        },
        sensing: {
          label: 'Cảm nhận',
          description: 'Bạn tập trung vào thực tế và chi tiết cụ thể.',
          key: 'sensing'
        },
        intuition: {
          label: 'Trực giác',
          description: 'Bạn thích khám phá khả năng và ý tưởng mới.',
          key: 'intuition'
        },
        balanced: {
          label: 'Cân bằng',
          description: 'Bạn có sự cân bằng giữa các đặc điểm tính cách.',
          key: 'balanced'
        }
      };

      const typeData = personalityTypes[personalityType] || personalityTypes.balanced;

      return {
        personalityType: typeData,
        score: null, // Không có score cho personality
        breakdown: {}
      };
    };

    setTimeout(() => {
      setQuiz(mockQuiz);
      setResult(calculateResult());
      setLoading(false);
    }, 1000);
  }, [quizId, personalityType, score, quizType, quizTitle, totalQuestions, correctAnswers, isPersonalityQuiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  // Thêm function hiển thị notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleRetake = () => {
    navigate(`/quiz/${quizId}/take`);
  };

  // Cập nhật function handleSendEmail
  const handleSendEmail = () => {
    setShowEmailModal(true);
  };

  // Thêm function gửi email thực tế
  const handleEmailSubmit = async () => {
    if (!emailAddress.trim()) {
      showNotification('Vui lòng nhập địa chỉ email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      showNotification('Email không hợp lệ', 'error');
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: emailAddress,
          quizTitle,
          quizType,
          isPersonalityQuiz,
          personalityType,
          score,
          correctAnswers,
          totalQuestions,
          timeSpent,
          description: result?.personalityType?.description || 'Không có mô tả'
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Email đã được gửi thành công!', 'success');
        setShowEmailModal(false);
        setEmailAddress('');
      } else {
        showNotification(data.message || 'Có lỗi xảy ra khi gửi email', 'error');
      }
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      showNotification('Không thể kết nối đến server', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Tạo nội dung chi tiết câu hỏi cho PDF
    const questionsContent = quizType === 'iq' && detailedResults.length > 0 ? `
      <div style="margin: 30px 0;">
        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Chi tiết từng câu hỏi:</h3>
        ${detailedResults.map((item, index) => `
          <div style="border: 1px solid ${item.isCorrect ? '#d4edda' : '#f8d7da'}; background: ${item.isCorrect ? '#d4edda' : '#f8d7da'}; margin: 15px 0; padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <h4 style="margin: 0; color: #333; flex: 1;">
                Câu ${index + 1}: ${item.questionContent}
                ${item.questionType === 'multi_choice' ? '<span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px;">Nhiều lựa chọn</span>' : ''}
              </h4>
              <span style="background: ${item.isCorrect ? '#c3e6cb' : '#f5c6cb'}; color: ${item.isCorrect ? '#155724' : '#721c24'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                ${item.isCorrect ? 'Đúng' : 'Sai'}
              </span>
            </div>
            
            <div style="margin: 10px 0;">
              <div style="margin-bottom: 8px;">
                <span style="color: #666; font-weight: bold; margin-right: 10px;">Bạn chọn:</span>
                <span style="color: ${item.isCorrect ? '#155724' : '#721c24'}; font-weight: bold;">
                  ${item.selectedAnswer || 'Không chọn đáp án nào'}
                </span>
              </div>
              
              ${!item.isCorrect ? `
                <div style="margin-bottom: 8px;">
                  <span style="color: #666; font-weight: bold; margin-right: 10px;">Đáp án đúng:</span>
                  <span style="color: #155724; font-weight: bold;">
                    ${item.correctAnswer || 'Không có đáp án đúng'}
                  </span>
                </div>
              ` : ''}
              
              ${item.questionType === 'multi_choice' && item.options ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                  <span style="color: #666; font-weight: bold; display: block; margin-bottom: 8px;">Tất cả lựa chọn:</span>
                  <div>
                    ${item.options.map(option => `
                      <div style="margin: 4px 0; display: flex; align-items: center;">
                        <span style="width: 16px; height: 16px; border: 1px solid ${option.is_correct ? '#28a745' : '#ccc'}; background: ${option.selected ? (option.is_correct ? '#d4edda' : '#f8d7da') : (option.is_correct ? '#e8f5e8' : '#f8f9fa')}; border-radius: 3px; margin-right: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px;">
                          ${option.selected ? '✓' : (option.is_correct ? '○' : '')}
                        </span>
                        <span style="color: ${option.is_correct ? '#155724' : '#666'}; ${option.is_correct ? 'font-weight: bold;' : ''} ${option.selected && !option.is_correct ? 'color: #721c24;' : ''}">
                          ${option.content}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    ` : '';

    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6;">
        <h1 style="text-align: center; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 30px;">
          Kết quả Quiz: ${quizTitle}
        </h1>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #007bff; text-align: center; margin-bottom: 15px;">
            ${(quizType === 'personality' || isPersonalityQuiz) ? `Nhóm tính cách: ${result?.personalityType?.label}` : `Điểm số: ${result?.score}`}
          </h2>
          <p style="text-align: center; font-size: 18px; margin: 10px 0; font-weight: 500;">
            ${quizType === 'iq' ? `Câu đúng: ${result?.correctAnswers}/${totalQuestions}` : `Loại tính cách: ${result?.personalityType?.label}`}
          </p>
          <p style="text-align: center; color: #666; font-style: italic; max-width: 600px; margin: 15px auto;">
            ${result?.personalityType?.description}
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
          ${(quizType === 'personality' || isPersonalityQuiz) ? `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1976d2; margin-bottom: 15px; font-size: 16px;">Thông tin tính cách</h3>
              <div style="space-y: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #1565c0;">Loại tính cách:</span>
                  <span style="font-weight: bold; color: #0d47a1;">${result?.personalityType?.label || personalityType}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #1565c0;">Hoàn thành:</span>
                  <span style="font-weight: bold; color: #0d47a1;">100%</span>
                </div>
              </div>
            </div>
          ` : `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1976d2; margin-bottom: 15px; font-size: 16px;">Kết quả chi tiết</h3>
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #1565c0;">Câu đúng:</span>
                  <span style="font-weight: bold; color: #0d47a1;">${result?.correctAnswers || 0}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #1565c0;">Câu sai:</span>
                  <span style="font-weight: bold; color: #0d47a1;">${result?.wrongAnswers || 0}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #1565c0;">Điểm số:</span>
                  <span style="font-weight: bold; color: #0d47a1;">${result?.score || 0}</span>
                </div>
              </div>
            </div>
          `}
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2e7d32; margin-bottom: 15px; font-size: 16px;">Thống kê bài làm</h3>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #1b5e20;">Tổng câu hỏi:</span>
                <span style="font-weight: bold; color: #0d5302;">${totalQuestions}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #1b5e20;">Tỷ lệ hoàn thành:</span>
                <span style="font-weight: bold; color: #0d5302;">${Math.round(completionRate || 100)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #1b5e20;">Thời gian làm bài:</span>
                <span style="font-weight: bold; color: #0d5302;">${formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>
        
        ${questionsContent}
        
        <footer style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="margin: 0;">Tạo bởi Quiz App - ${new Date().toLocaleDateString('vi-VN')}</p>
        </footer>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kết quả Quiz - ${quizTitle}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 1in; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tính toán kết quả...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 max-w-4xl mx-auto">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Gửi kết quả qua Email</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ email
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={emailLoading}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEmailSubmit}
                disabled={emailLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {emailLoading ? 'Đang gửi...' : 'Gửi Email'}
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailAddress('');
                }}
                disabled={emailLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Kết quả bài làm</h1>
        <h2 className="text-gray-600 text-sm">{quiz?.title}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-3">
            <span className="text-xl font-bold text-primary">
              {(quizType === 'personality' || isPersonalityQuiz) ? '🎭' : `${result?.score || 0}`}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {(quizType === 'personality' || isPersonalityQuiz) && personalityType && personalityType !== 'balanced'
              ? `Nhóm tính cách: ${result?.personalityType?.label || personalityType}`
              : quizType === 'iq'
                ? `Điểm của bạn: ${result?.score || 0}`
                : `Nhóm tính cách: ${result?.personalityType?.label || 'Không xác định'}`
            }
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-sm">
            {result?.personalityType?.description || 'Không có mô tả'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {(quizType === 'personality' || isPersonalityQuiz) ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm">Thông tin tính cách</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Loại tính cách:</span>
                  <span className="font-medium text-blue-800 text-sm">{result?.personalityType?.label || personalityType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Hoàn thành:</span>
                  <span className="font-medium text-blue-800 text-sm">100%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm">Kết quả chi tiết</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Câu đúng:</span>
                  <span className="font-medium text-blue-800 text-sm">{result?.correctAnswers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Câu sai:</span>
                  <span className="font-medium text-blue-800 text-sm">{result?.wrongAnswers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Điểm số:</span>
                  <span className="font-medium text-blue-800 text-sm">{result?.score || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Thống kê bài làm</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Tổng câu hỏi</span>
                <span className="font-medium text-green-800 text-sm">{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Tỷ lệ hoàn thành</span>
                <span className="font-medium text-green-800 text-sm">
                  {Math.round(completionRate || 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Thời gian làm bài</span>
                <span className="font-medium text-green-800 text-sm">{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết từng câu hỏi cho IQ quiz */}
      {quizType === 'iq' && detailedResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Chi tiết từng câu hỏi</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {detailedResults.map((item, index) => (
              <div
                key={item.questionId}
                className={`border rounded-lg p-4 ${item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 flex-1">
                    Câu {index + 1}: {item.questionContent}
                    {item.questionType === 'multi_choice' && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Nhiều lựa chọn
                      </span>
                    )}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {item.isCorrect ? 'Đúng' : 'Sai'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-sm text-gray-600 w-24 flex-shrink-0">Bạn chọn:</span>
                    <span className={`text-sm font-medium ${item.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {item.selectedAnswer || 'Không chọn đáp án nào'}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-start">
                      <span className="text-sm text-gray-600 w-24 flex-shrink-0">Đáp án đúng:</span>
                      <span className="text-sm font-medium text-green-700">
                        {item.correctAnswer || 'Không có đáp án đúng'}
                      </span>
                    </div>
                  )}

                  {/* Hiển thị tất cả options cho multi-choice */}
                  {item.questionType === 'multi_choice' && item.options && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600 block mb-2">Tất cả lựa chọn:</span>
                      <div className="grid grid-cols-1 gap-1">
                        {item.options.map((option, optIndex) => (
                          <div key={option.id} className="flex items-center text-sm">
                            <span className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${option.selected
                              ? (option.is_correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                              : (option.is_correct ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300')
                              }`}>
                              {option.selected && (
                                <span className={`text-xs ${option.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                  ✓
                                </span>
                              )}
                              {!option.selected && option.is_correct && (
                                <span className="text-xs text-green-700">○</span>
                              )}
                            </span>
                            <span className={`${option.is_correct ? 'font-medium text-green-700' : 'text-gray-600'
                              } ${option.selected && !option.is_correct ? 'text-red-600' : ''}`}>
                              {option.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button onClick={handleRetake} className="bg-primary hover:bg-darkPrimary text-white font-medium px-4 py-3 rounded-lg text-sm">
          Làm lại
        </button>
        <button onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg text-sm">
          Gửi Gmail
        </button>
        <button onClick={handleDownloadPDF} className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-3 rounded-lg text-sm">
          Tải PDF
        </button>
        <button onClick={handleBackToHome} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg text-sm">
          Trang chủ
        </button>
      </div>
    </div>
  );
}

export default QuizResult;