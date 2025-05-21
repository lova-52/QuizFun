import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Home/Navbar/Navbar';
import Footer from '../../Home/Footer/Footer';
import CategoryCard from '../../Home/Categories/CategoryCard';
import QuizCard from './QuizCard';

function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleQuizzes, setVisibleQuizzes] = useState([]);
  
  // Danh sách các category
  const categories = [
    {
      id: "1",
      title: "Tính cách",
      description: "Khám phá những điều thú vị về tính cách của bạn",
      image: "https://images.careerviet.vn/content/images/tinh-cach-la-gi-careerbuilder-5.png",
      quizCount: "150+ Quiz",
    },
    {
      id: "2",
      title: "Sở thích",
      description: "Tìm hiểu sở thích phù hợp với bạn",
      image: "https://goga.ai/wp-content/uploads/2022/10/gioi-thieu-so-thich-bang-tieng-anh-4-1.png",
      quizCount: "120+ Quiz",
    },
    {
      id: "3",
      title: "Giải trí",
      description: "Thư giãn với những câu đố vui nhộn",
      image: "https://etimg.etb2bimg.com/photo/81478822.cms",
      quizCount: "180+ Quiz",
    },
    {
      id: "4",
      title: "Học tập",
      description: "Kiểm tra kiến thức với các bài thi thử",
      image: "https://dhannd.edu.vn/image/cache/catalog/00_hinh_anh/p_6/210630_1.bia-900x600.jpeg",
      quizCount: "200+ Quiz",
    },
    {
      id: "5",
      title: "Công nghệ",
      description: "Những bài trắc nghiệm về công nghệ hiện đại",
      image: "https://api.placeholder.com/400/320",
      quizCount: "90+ Quiz",
    },
    {
      id: "6",
      title: "Thể thao",
      description: "Kiểm tra kiến thức của bạn về thể thao",
      image: "https://api.placeholder.com/400/320",
      quizCount: "100+ Quiz",
    },
    {
      id: "7",
      title: "Âm nhạc",
      description: "Khám phá thế giới âm nhạc qua các bài trắc nghiệm",
      image: "https://api.placeholder.com/400/320",
      quizCount: "80+ Quiz",
    },
    {
      id: "8",
      title: "Du lịch",
      description: "Trải nghiệm văn hóa và địa điểm du lịch",
      image: "https://api.placeholder.com/400/320",
      quizCount: "70+ Quiz",
    }
  ];

  // Danh sách các quiz mẫu
  const quizzes = [
    {
      id: "101",
      title: "Bạn thuộc tính cách nào?",
      description: "Trắc nghiệm kiểm tra tính cách MBTI",
      image: "https://api.placeholder.com/400/320",
      categoryId: "1",
      questionCount: 24,
      completionTime: "15 phút",
      difficulty: "Trung bình",
      participantCount: 25000
    },
    {
      id: "102",
      title: "Bạn thích hợp với ngành nghề nào?",
      description: "Khám phá nghề nghiệp phù hợp với tính cách",
      image: "https://api.placeholder.com/400/320",
      categoryId: "1",
      questionCount: 20,
      completionTime: "12 phút",
      difficulty: "Dễ",
      participantCount: 18000
    },
    {
      id: "201",
      title: "Bạn thích hợp với môn thể thao nào?",
      description: "Tìm hiểu môn thể thao phù hợp với bạn",
      image: "https://api.placeholder.com/400/320",
      categoryId: "2",
      questionCount: 15,
      completionTime: "10 phút",
      difficulty: "Dễ",
      participantCount: 12000
    },
    {
      id: "301",
      title: "Bạn biết gì về phim Marvel?",
      description: "Trắc nghiệm dành cho fan Marvel",
      image: "https://api.placeholder.com/400/320",
      categoryId: "3",
      questionCount: 30,
      completionTime: "20 phút",
      difficulty: "Khó",
      participantCount: 35000
    },
    {
      id: "401",
      title: "Kiểm tra kiến thức toán học cơ bản",
      description: "Ôn tập kiến thức toán học phổ thông",
      image: "https://api.placeholder.com/400/320",
      categoryId: "4",
      questionCount: 25,
      completionTime: "30 phút",
      difficulty: "Trung bình",
      participantCount: 42000
    },
    {
      id: "402",
      title: "Trắc nghiệm Tiếng Anh B1",
      description: "Luyện thi chứng chỉ B1",
      image: "https://api.placeholder.com/400/320",
      categoryId: "4",
      questionCount: 40,
      completionTime: "45 phút",
      difficulty: "Khó",
      participantCount: 28000
    }
  ];

  // Cập nhật danh sách quiz hiển thị dựa trên category được chọn
  useEffect(() => {
    if (activeCategory === 'all') {
      // Hiển thị các quiz nổi bật từ tất cả các category
      setVisibleQuizzes(quizzes.slice(0, 6));
    } else {
      // Lọc quiz theo category ID
      const filteredQuizzes = quizzes.filter(quiz => quiz.categoryId === activeCategory);
      setVisibleQuizzes(filteredQuizzes);
    }
  }, [activeCategory]);

  // Hàm xử lý khi người dùng click vào một category
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Hàm xử lý khi người dùng click vào nút "Hiển thị tất cả"
  const handleShowAllClick = () => {
    setActiveCategory('all');
  };

  // Hiển thị quizzes nếu không có quiz nào trong category đó
  const renderNoQuizzes = () => {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">Chưa có quiz nào trong danh mục này</p>
        <button 
          onClick={handleShowAllClick}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-darkPrimary transition-colors"
        >
          Hiển thị tất cả
        </button>
      </div>
    );
  };

  return (
    <>
      <Navbar 
        onLoginClick={() => {}} 
        onRegisterClick={() => {}} 
      />
      
      {/* Banner/Header */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16 mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Khám phá các chủ đề trắc nghiệm</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Tìm hiểu về bản thân, kiểm tra kiến thức và giải trí với hàng ngàn bài trắc nghiệm đa dạng
            </p>
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Danh mục chủ đề</h2>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <div key={category.id} onClick={() => handleCategoryClick(category.id)}>
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
      </section>

           {/* Filter Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 flex-wrap ml-auto justify-end">
              <button 
                onClick={handleShowAllClick}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả
              </button>
              {categories.slice(0, 5).map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.title}
                </button>
              ))}
              <div className="relative group">
                <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Xem thêm
                </button>
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {categories.slice(5).map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeCategory === 'all' 
                ? 'Trắc nghiệm nổi bật' 
                : `Trắc nghiệm ${categories.find(cat => cat.id === activeCategory)?.title || ''}`}
            </h2>
            <p className="text-gray-600 mt-2">
              {activeCategory === 'all' 
                ? 'Những bài trắc nghiệm được yêu thích nhất' 
                : `Khám phá các bài trắc nghiệm về ${categories.find(cat => cat.id === activeCategory)?.title || ''}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleQuizzes.length > 0 ? (
              visibleQuizzes.map(quiz => (
                <QuizCard 
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  image={quiz.image}
                  questionCount={quiz.questionCount}
                  completionTime={quiz.completionTime}
                  difficulty={quiz.difficulty}
                  participantCount={quiz.participantCount}
                />
              ))
            ) : (
              renderNoQuizzes()
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CategoriesPage;