import React, { useState, useEffect } from 'react';

const EditQuizModal = ({ onClose, onUpdate, quizId }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    timeLimit: 0,
    quizType: 'iq',
    imageUrl: null // ← THÊM để lưu ảnh quiz
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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

    // ← SỬA: Gọi đúng API endpoint
    if (quizId) {
      fetch(`http://localhost:5000/api/admin/quizzes/${quizId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const quiz = data.data;
            setFormData({
              title: quiz.title,
              description: quiz.description,
              categoryId: quiz.category_id, // ← SỬA: category_id thay vì categoryId
              timeLimit: quiz.time_limit,   // ← SỬA: time_limit thay vì timeLimit
              quizType: quiz.quiz_type,     // ← SỹA: quiz_type thay vì quizType
              imageUrl: quiz.image_url      // ← THÊM: ảnh quiz
            });
            setQuestions(quiz.questions || []);
          } else {
            alert('Không thể tải dữ liệu quiz');
          }
          setLoadingData(false);
        })
        .catch(err => {
          console.error('Lỗi khi tải quiz:', err);
          alert('Lỗi khi tải dữ liệu quiz');
          setLoadingData(false);
        });
    }
  }, [quizId]);

  const addQuestion = () => {
    setQuestions([...questions, {
      content: '',
      type: 'single_choice',
      imageFile: null,
      imagePreview: null,
      imageUrl: null,
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
  
  // ← THÊM: Auto-detect question type dựa trên số đáp án đúng
  if (field === 'isCorrect') {
    const correctCount = newQuestions[questionIndex].answers.filter(a => a.isCorrect).length;
    newQuestions[questionIndex].type = correctCount > 1 ? 'multi_choice' : 'single_choice';
    
    console.log(`Question ${questionIndex + 1}: ${correctCount} correct answers -> ${newQuestions[questionIndex].type}`);
  }
  
  setQuestions(newQuestions);
};


  const handleQuestionImageChange = (e, questionIndex) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateQuestion(questionIndex, 'imagePreview', e.target.result);
        updateQuestion(questionIndex, 'imageFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQuestionImage = (questionIndex) => {
    updateQuestion(questionIndex, 'imagePreview', null);
    updateQuestion(questionIndex, 'imageFile', null);
    updateQuestion(questionIndex, 'imageUrl', null);
  };

  const uploadQuestionImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('questionImage', file);

    try {
      const response = await fetch('http://localhost:5000/api/admin/questions/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.filePath;
      } else {
        alert(data.message || 'Upload hình ảnh thất bại');
        return null;
      }
    } catch (error) {
      console.error('Error uploading question image:', error);
      alert('Lỗi upload hình ảnh câu hỏi');
      return null;
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== SUBMIT EDIT QUIZ ===');
    console.log('Questions trước khi gửi:', questions);
    
    // Làm sạch dữ liệu trước khi gửi
    const cleanQuestions = questions
      .filter(q => q.content && q.content.trim() !== '')
      .map((question, index) => ({
        content: question.content.trim(),
        type: question.type || 'single_choice',
        imageUrl: question.imageUrl, // Giữ URL cũ
        imageFile: question.imageFile, // File mới nếu có
        answers: question.answers
          .filter(a => a.content && a.content.trim() !== '')
          .map(answer => ({
            content: answer.content.trim(),
            isCorrect: answer.isCorrect || false,
            isPersonality: answer.isPersonality || null
          }))
      }))
      .filter(q => q.answers.length >= 2);

    console.log('Questions sau khi làm sạch:', cleanQuestions);

    if (cleanQuestions.length === 0) {
      alert('Phải có ít nhất một câu hỏi hợp lệ với ít nhất 2 đáp án');
      return;
    }

    setLoading(true);

    try {
      // ← SỬA: Upload ảnh cho từng câu hỏi trước
      const questionsWithImages = [];
      
      for (let i = 0; i < cleanQuestions.length; i++) { // ← SỬA dòng này
  const question = cleanQuestions[i]; // ← SỬA dòng này
  let questionImageUrl = question.imageUrl;
  
  if (question.imageFile) {
    const newImageUrl = await uploadQuestionImage(question.imageFile);
    if (newImageUrl) {
      questionImageUrl = newImageUrl;
    }
  }
        
       questionsWithImages.push({
    content: question.content.trim(),
    type: question.type || 'single_choice',
    imageUrl: questionImageUrl,
    answers: question.answers
  });
}

      const response = await fetch(`http://localhost:5000/api/admin/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          categoryId: formData.categoryId,
          timeLimit: formData.timeLimit,
          quizType: formData.quizType,
          questions: questionsWithImages,
          imageUrl: formData.imageUrl || null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdate();
        alert('Cập nhật quiz thành công!');
      } else {
        alert(data.message || 'Cập nhật quiz thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi kết nối đến server');
    }

    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Chỉnh sửa Quiz</h3>
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

                  {/* Phần upload ảnh câu hỏi */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Hình ảnh câu hỏi (tùy chọn)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionImageChange(e, qIndex)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    {(question.imagePreview || question.imageUrl) && (
                      <div className="mt-2">
                        <img 
                          src={question.imagePreview || question.imageUrl} 
                          alt="Preview câu hỏi" 
                          className="max-w-xs max-h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeQuestionImage(qIndex)}
                          className="ml-2 text-red-500 text-sm hover:text-red-700"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Phần answers */}
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
                            className="w-32 border border-gray-300 rounded px-2 py-1"
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
                {loading ? 'Đang cập nhật...' : 'Cập nhật Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;
