import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

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
          description: `Bạn đã trả lời đúng ${correctAnswers || Math.round((score/100) * totalQuestions)} / ${totalQuestions} câu hỏi.`,
        },
        score: score,
        correctAnswers: correctAnswers || Math.round((score/100) * totalQuestions),
        wrongAnswers: totalQuestions - (correctAnswers || Math.round((score/100) * totalQuestions)),
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

  const handleRetake = () => {
    navigate(`/quiz/${quizId}/take`);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Kết quả Quiz: ${quizTitle}`);
    const body = encodeURIComponent(`
Chào bạn,

Tôi vừa hoàn thành bài quiz "${quizTitle}" với kết quả sau:

🎯 ${(quizType === 'personality' || isPersonalityQuiz) ? `Nhóm tính cách: ${result?.personalityType?.label}` : `Điểm số: ${result?.score}%`}
📊 ${quizType === 'iq' ? `Câu đúng: ${result?.correctAnswers}/${totalQuestions}` : `Loại tính cách: ${result?.personalityType?.label}`}
📋 Tổng câu hỏi: ${totalQuestions}
⏱️ Thời gian: ${formatTime(timeSpent)}

📝 Mô tả: ${result?.personalityType?.description}

Trân trọng!
    `);

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownloadPDF = () => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Kết quả Quiz: ${quizTitle}
        </h1>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #007bff; text-align: center;">
            ${(quizType === 'personality' || isPersonalityQuiz) ? `Nhóm tính cách: ${result?.personalityType?.label}` : `Điểm số: ${result?.score}%`}
          </h2>
          <p style="text-align: center; font-size: 18px; margin: 10px 0;">
            ${quizType === 'iq' ? `Câu đúng: ${result?.correctAnswers}/${totalQuestions}` : `Loại tính cách: ${result?.personalityType?.label}`}
          </p>
          <p style="text-align: center; color: #666;">${result?.personalityType?.description}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3>Thống kê bài làm:</h3>
          <ul>
            <li>Tổng số câu hỏi: ${totalQuestions}</li>
            <li>Tỷ lệ hoàn thành: ${Math.round(completionRate || 100)}%</li>
            <li>Thời gian làm bài: ${formatTime(timeSpent)}</li>
          </ul>
        </div>
        <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
          <p>Tạo bởi Quiz App - ${new Date().toLocaleDateString('vi-VN')}</p>
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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Kết quả bài làm</h1>
        <p className="text-gray-600 text-sm">{quiz?.title}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-3">
            <span className="text-xl font-bold text-primary">
              {(quizType === 'personality' || isPersonalityQuiz) ? '🎭' : `${result?.score || 0}%`}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {(quizType === 'personality' || isPersonalityQuiz) && personalityType && personalityType !== 'balanced'
              ? `Nhóm tính cách: ${result?.personalityType?.label || personalityType}` 
              : quizType === 'iq'
              ? `Điểm của bạn: ${result?.score || 0}%`
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
                  <span className="font-medium text-blue-800 text-sm">{result?.score || 0}%</span>
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
                className={`border rounded-lg p-4 ${
                  item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 flex-1">
                    Câu {index + 1}: {item.questionContent}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isCorrect ? 'Đúng' : 'Sai'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-24">Bạn chọn:</span>
                    <span className={`text-sm font-medium ${
                      item.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.selectedAnswer}
                    </span>
                  </div>
                  
                  {!item.isCorrect && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-24">Đáp án đúng:</span>
                      <span className="text-sm font-medium text-green-700">
                        {item.correctAnswer}
                      </span>
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
