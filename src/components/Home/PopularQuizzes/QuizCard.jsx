import React from 'react';

function QuizCard({ quiz }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 quiz-card-hover transform transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48 bg-gray-100">
        <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover" />
        <div className={`absolute top-3 left-3 bg-${quiz.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {quiz.badge.text}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="text-white font-medium">{quiz.title}</span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {quiz.duration}
          </span>
        </div>
        <div className="quiz-overlay absolute inset-0 bg-primary bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-300">
          <div className="bg-white rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className={`bg-${quiz.categoryColor}-100 text-${quiz.categoryColor === 'blue' ? 'primary' : quiz.categoryColor + '-700'} text-xs px-2 py-1 rounded-md font-medium`}>
              {quiz.category}
            </span>
            <span className="ml-2 text-sm text-gray-500">{quiz.questionCount}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" stroke="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-sm font-medium ml-1">{quiz.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <img src="/api/placeholder/100/100" alt="User" className="w-6 h-6 rounded-full border border-white" />
            <img src="/api/placeholder/100/100" alt="User" className="w-6 h-6 rounded-full border border-white" />
            <img src="/api/placeholder/100/100" alt="User" className="w-6 h-6 rounded-full border border-white" />
            <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium">{quiz.userCount}</div>
          </div>
          <a href="#" className="text-primary hover:text-darkPrimary font-medium text-sm flex items-center transition-colors">
            Làm ngay
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;