import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const { answers, totalQuestions, completionRate, timeSpent } = location.state || {};

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
      ]
    };

    const calculateResult = () => {
      if (!answers) return null;

      const personalityTypes = {
        extrovert: { count: 0, label: 'Hướng ngoại', description: 'Bạn là người năng động, thích giao tiếp và làm việc với nhiều người.' },
        introvert: { count: 0, label: 'Hướng nội', description: 'Bạn là người thích suy ngẫm, làm việc độc lập và cần thời gian riêng.' },
        thinking: { count: 0, label: 'Lý trí', description: 'Bạn đưa ra quyết định dựa trên logic và phân tích khách quan.' },
        feeling: { count: 0, label: 'Cảm xúc', description: 'Bạn quyết định dựa trên cảm xúc và tác động đến con người.' }
      };

      Object.entries(answers).forEach(([questionId, answerIndex]) => {
        const qId = parseInt(questionId);
        if ([1, 5, 11, 14, 19].includes(qId)) {
          if ([0, 2, 3].includes(answerIndex)) {
            personalityTypes.extrovert.count++;
          } else {
            personalityTypes.introvert.count++;
          }
        }
        if ([3, 7, 13, 15, 20].includes(qId)) {
          if ([0, 2].includes(answerIndex)) {
            personalityTypes.thinking.count++;
          } else {
            personalityTypes.feeling.count++;
          }
        }
      });

      const dominantType = Object.entries(personalityTypes).reduce(
        (max, [key, value]) => value.count > max.count ? { key, ...value } : max,
        { key: 'balanced', count: 0, label: 'Cân bằng', description: 'Bạn có sự cân bằng giữa các đặc điểm tính cách.' }
      );

      return {
        personalityType: dominantType,
        breakdown: personalityTypes,
        score: Math.round((Object.keys(answers).length / totalQuestions) * 100)
      };
    };

    setTimeout(() => {
      setQuiz(mockQuiz);
      setResult(calculateResult());
      setLoading(false);
    }, 1000);
  }, [quizId, answers, totalQuestions]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  const handleRetake = () => {
    navigate(`/quiz/${quizId}/take`);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Kết quả Quiz: ${quiz?.title}`);
    const body = encodeURIComponent(`
Chào bạn,

Tôi vừa hoàn thành bài quiz "${quiz?.title}" với kết quả sau:

🎯 Nhóm tính cách: ${result?.personalityType.label}
📊 Điểm số: ${result?.score}%
📋 Số câu trả lời: ${Object.keys(answers).length}/${totalQuestions}
⏱️ Thời gian: ${formatTime(timeSpent)}

📝 Mô tả: ${result?.personalityType.description}

Trân trọng!
    `);

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownloadPDF = () => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Kết quả Quiz: ${quiz?.title}
        </h1>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #007bff; text-align: center;">Nhóm tính cách: ${result?.personalityType.label}</h2>
          <p style="text-align: center; font-size: 18px; margin: 10px 0;">Điểm số: ${result?.score}%</p>
          <p style="text-align: center; color: #666;">${result?.personalityType.description}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3>Thống kê bài làm:</h3>
          <ul>
            <li>Câu đã trả lời: ${Object.keys(answers).length}/${totalQuestions}</li>
            <li>Tỷ lệ hoàn thành: ${Math.round(completionRate)}%</li>
            <li>Thời gian làm bài: ${formatTime(timeSpent)}</li>
          </ul>
        </div>
        <div style="margin: 20px 0;">
          <h3>Chi tiết câu trả lời:</h3>
          ${quiz?.questions.map((question, index) => `
            <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid #007bff;">
              <strong>Câu ${index + 1}:</strong> ${question.question}<br>
              <span style="color: ${answers[question.id] !== undefined ? '#28a745' : '#6c757d'};">
                ${answers[question.id] !== undefined 
                  ? `✓ ${question.options[answers[question.id]]}` 
                  : '⚪ Chưa trả lời'}
              </span>
            </div>
          `).join('')}
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
          <title>Kết quả Quiz - ${quiz?.title}</title>
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

  if (!answers || !totalQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy kết quả</h2>
          <p className="text-gray-600 mt-2">Vui lòng làm bài quiz trước khi xem kết quả.</p>
          <button 
            onClick={() => navigate(`/quiz/${quizId}`)}
            className="mt-4 bg-primary hover:bg-darkPrimary text-white px-6 py-2 rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-xl font-bold text-primary">{result?.score}%</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Nhóm tính cách: {result?.personalityType.label}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-sm">
            {result?.personalityType.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Phân tích tính cách</h3>
            <div className="space-y-2">
              {Object.entries(result?.breakdown || {}).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-blue-700 text-sm">{data.label}</span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-blue-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(data.count / Math.max(...Object.values(result?.breakdown).map(d => d.count))) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{data.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Thống kê bài làm</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Câu đã trả lời</span>
                <span className="font-medium text-green-800 text-sm">{Object.keys(answers).length}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Tỷ lệ hoàn thành</span>
                <span className="font-medium text-green-800 text-sm">{Math.round(completionRate)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 text-sm">Thời gian làm bài</span>
                <span className="font-medium text-green-800 text-sm">{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
