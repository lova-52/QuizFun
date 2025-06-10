import React from 'react';
import { Link } from 'react-router-dom';

function QuizCard({ quiz }) {
  return (
    <Link
      to={`/quiz/${quiz.id}`}
      className="block w-full"
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 quiz-card-hover transform transition-all duration-300 hover:-translate-y-2 w-full"
      >
        <div className="relative h-56 bg-gray-100">
          <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover" />
          <div className="quiz-overlay absolute inset-0 bg-primary bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-300">
            <div className="bg-white rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{quiz.title}</h3>
          <div className="text-xs text-gray-500 mb-2">
            Lượt làm: {quiz.completions.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default QuizCard;