import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from './CategoryCard';

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Chỉ lấy 4 categories đầu tiên
          setCategories(result.data.slice(0, 4));
        } else {
          throw new Error('Không thể lấy dữ liệu categories');
        }
      } catch (err) {
        console.error('Lỗi khi fetch categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <section className="mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <section className="mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-red-600">
            <p>Lỗi: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories-section" className="mb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header với responsive "Xem tất cả" */}
        <div className="flex justify-between items-end mb-6 md:mb-10">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Đa dạng chủ đề</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Khám phá theo chủ đề</h2>
          </div>
          {/* Desktop "Xem tất cả" */}
          <Link to="/categories" className="hidden sm:flex items-center text-primary hover:text-darkPrimary transition-colors font-medium">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* Category Cards với responsive layout */}
        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              image={category.image}
              quizCount={category.quizCount}
            />
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="flex-none w-[75vw] max-w-[300px] snap-start"
              >
                <CategoryCard 
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  image={category.image}
                  quizCount={category.quizCount}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile "Xem tất cả" button */}
        <div className="sm:hidden mt-6 text-center">
          <Link 
            to="/categories" 
            className="inline-flex items-center bg-primary hover:bg-darkPrimary text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Xem tất cả chủ đề
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Custom CSS để ẩn scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default CategoriesSection;