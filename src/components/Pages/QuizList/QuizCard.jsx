import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ id, title, image, description, difficulty, questionCount, completions }) {
  // Function để xác định màu dựa trên độ khó
  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Dễ': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Khó': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="h-48 md:h-full bg-gray-200 overflow-hidden">
            <img className="w-full h-full object-cover" src={image} alt={title} />
          </div>
        </div>
        <div className="p-6 md:w-2/3">
          <div className="flex items-center mb-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
            <span className="text-xs text-gray-500 ml-2">{questionCount} câu hỏi</span>
            <span className="text-xs text-gray-500 ml-2">{completions} lượt làm</span>
          </div>
          <Link to={`/quiz/${id}`} className="block">
            <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary transition-colors">{title}</h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <Link 
              to={`/quiz/${id}`} 
              className="bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              Xem chi tiết
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="text-gray-500 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;