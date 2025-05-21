import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ id, title, description, image, questionCount, completionTime, difficulty, participantCount }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow">
          {questionCount} câu hỏi
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary text-xs font-bold">{completionTime}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            difficulty === 'Dễ' ? 'bg-green-100 text-green-700' :
            difficulty === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>{difficulty}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">
            <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(participantCount)}</span> người tham gia
          </span>
          <Link to={`/quiz/${id}`} className="flex items-center text-primary hover:text-darkPrimary font-medium text-sm">
            Bắt đầu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;