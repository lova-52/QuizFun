import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ id, title, image, description, questionCount, completions }) {
  // Cắt ngắn mô tả, hiển thị tối đa 100 ký tự và thêm ...
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="h-48 md:h-full bg-gray-200 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src={image} 
              alt={title} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
            />
          </div>
        </div>
        <div className="p-6 md:w-2/3">
          <div className="flex items-center mb-2">
            <span className="text-xs text-gray-500 ml-2">{questionCount} câu hỏi</span>
            <span className="text-xs text-gray-500 ml-2">{completions} lượt làm</span>
          </div>
          <Link to={`/quiz/${id}`} className="block">
            <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary transition-colors">{title}</h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{truncatedDescription}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;