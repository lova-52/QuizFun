// components/CategoriesSection.jsx
import React from 'react';
import CategoryCard from './CategoryCard';

function CategoriesSection() {
  const categories = [
    {
      id: 1,
      title: "Tính cách",
      description: "Khám phá những điều thú vị về tính cách của bạn",
      image: "https://images.careerviet.vn/content/images/tinh-cach-la-gi-careerbuilder-5.png",
      quizCount: "150+ Quiz",
    },
    {
      id: 2,
      title: "Sở thích",
      description: "Tìm hiểu sở thích phù hợp với bạn",
      image: "https://goga.ai/wp-content/uploads/2022/10/gioi-thieu-so-thich-bang-tieng-anh-4-1.png",
      quizCount: "120+ Quiz",
    },
    {
      id: 3,
      title: "Giải trí",
      description: "Thư giãn với những câu đố vui nhộn",
      image: "https://etimg.etb2bimg.com/photo/81478822.cms",
      quizCount: "180+ Quiz",
    },
    {
      id: 4,
      title: "Học tập",
      description: "Kiểm tra kiến thức với các bài thi thử",
      image: "https://dhannd.edu.vn/image/cache/catalog/00_hinh_anh/p_6/210630_1.bia-900x600.jpeg",
      quizCount: "200+ Quiz",
    }
  ];

  return (
    <section className="mb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Đa dạng chủ đề</p>
            <h2 className="text-3xl font-bold text-gray-800">Khám phá theo chủ đề</h2>
          </div>
          <a href="#" className="hidden md:flex items-center text-primary hover:text-darkPrimary transition-colors font-medium">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              title={category.title}
              description={category.description}
              image={category.image}
              quizCount={category.quizCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;