import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ id, title, image, description, questionCount, completions }) {
  // Cắt ngắn mô tả, hiển thị tối đa 100 ký tự và thêm ...
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 md:w-1/3">
          <div className="h-48 sm:h-full bg-gray-200 overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src={image} 
              alt={title} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
            />
          </div>
        </div>
        <div className="p-4 sm:p-6 sm:w-2/3 md:w-2/3 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{questionCount} câu hỏi</span>
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{completions} lượt làm</span>
            </div>
          </div>
          
          <Link to={`/quiz/${id}`} className="block mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {truncatedDescription}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <Link 
              to={`/quiz/${id}`} 
              className="bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center text-sm"
            >
              <span className="hidden sm:inline">Xem chi tiết</span>
              <span className="sm:hidden">Xem</span>
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