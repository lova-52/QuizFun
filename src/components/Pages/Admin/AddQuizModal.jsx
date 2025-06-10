import React, { useState, useEffect } from 'react';

const AddQuizModal = ({ onClose, onAdd }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    timeLimit: 0,
    quizType: 'iq'
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy danh sách categories
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, {
      content: '',
      type: 'single_choice',
      answers: [
        { content: '', isCorrect: false, isPersonality: '' },
        { content: '', isCorrect: false, isPersonality: '' },
        { content: '', isCorrect: false, isPersonality: '' },
        { content: '', isCorrect: false, isPersonality: '' }
      ]
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateAnswer = (questionIndex, answerIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.categoryId || questions.length === 0) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.content) {
        alert(`Câu hỏi ${i + 1} không được để trống`);
        return;
      }
      
      const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
      if (formData.quizType === 'iq' && !hasCorrectAnswer) {
        alert(`Câu hỏi ${i + 1} phải có ít nhất một đáp án đúng`);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          questions
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onAdd(data.data);
        alert('Tạo quiz thành công!');
      } else {
        alert(data.message || 'Tạo quiz thất bại');
      }
    } catch (error) {
      alert('Lỗi khi kết nối đến server');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Thêm Quiz Mới</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Quiz Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thời gian (phút)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loại quiz</label>
                <select
                  value={formData.quizType}
                  onChange={(e) => setFormData({...formData, quizType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="iq">IQ Quiz</option>
                  <option value="personality">Personality Quiz</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mô tả *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="3"
                required
              />
            </div>

            {/* Questions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Câu hỏi</h4>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  + Thêm câu hỏi
                </button>
              </div>

              {questions.map((question, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Câu hỏi {qIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Nhập nội dung câu hỏi"
                    value={question.content}
                    onChange={(e) => updateQuestion(qIndex, 'content', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.answers.map((answer, aIndex) => (
                      <div key={aIndex} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={(e) => updateAnswer(qIndex, aIndex, 'isCorrect', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          placeholder={`Đáp án ${aIndex + 1}`}
                          value={answer.content}
                          onChange={(e) => updateAnswer(qIndex, aIndex, 'content', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1"
                        />
                        {formData.quizType === 'personality' && (
                          <input
                            type="text"
                            placeholder="Personality"
                            value={answer.isPersonality}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'isPersonality', e.target.value)}
                            className="w-20 border border-gray-300 rounded px-2 py-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuizModal;
