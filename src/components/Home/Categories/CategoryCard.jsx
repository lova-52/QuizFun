import React from 'react';
import { Link } from 'react-router-dom';

function CategoryCard({ id, title, description, image, quizCount }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 z-10"></div>
      <div className="h-52 bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2 opacity-90">{quizCount}</div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-200 text-sm mb-3">{description}</p>
        <Link to={`/category/${id}`} className="flex items-center text-white font-medium text-sm">
          Bắt đầu
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default CategoryCard;