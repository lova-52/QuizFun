import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../Home/Navbar/Navbar';
import Footer from '../../Home/Footer/Footer';
import QuizCard from './QuizCard';
import FilterSidebar from './FilterSidebar';

function CategoryQuizzes() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedSort, setSelectedSort] = useState('popular');

  // Sort options
  const sortOptions = [
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'a-z', label: 'Tên A-Z' },
    { value: 'z-a', label: 'Tên Z-A' },
  ];

  // Fetch category và quizzes từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin category
        const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        if (!categoryResponse.ok) throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        const categoryResult = await categoryResponse.json();
        if (categoryResult.success) {
          const foundCategory = categoryResult.data.find(cat => cat.id === categoryId);
          setCategory(foundCategory || null);
        } else {
          throw new Error('Không thể lấy dữ liệu categories');
        }

        // Lấy danh sách quizzes theo categoryId
        const quizzesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes?categoryId=${categoryId}`);
        if (!quizzesResponse.ok) throw new Error(`HTTP error! status: ${quizzesResponse.status}`);
        const quizzesResult = await quizzesResponse.json();
        if (quizzesResult.success) {
          setQuizzes(quizzesResult.data);
          setFilteredQuizzes(quizzesResult.data);
        } else {
          throw new Error('Không thể lấy dữ liệu quizzes');
        }
      } catch (err) {
        console.error('Lỗi khi fetch dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId]);

  // Apply filters khi các state filter thay đổi
  useEffect(() => {
    let result = [...quizzes];

    // Apply sorting
    switch (selectedSort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.completions || 0) - (a.completions || 0));
        break;
    }

    setFilteredQuizzes(result);
  }, [quizzes, selectedSort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy chủ đề này</h2>
            <p className="mt-2 text-gray-600">Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="mt-6 inline-block bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner */}
      <div
        className="relative h-48 md:h-64 w-full bg-center bg-cover"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="container relative mx-auto px-4 h-full max-w-7xl flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{category.title}</h1>
          <p className="text-gray-200 max-w-lg text-sm md:text-base">{category.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
          <div className="lg:w-1/4 hidden lg:block">
            <FilterSidebar
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Mobile Filters Toggle & Sort */}
            <div className="lg:hidden flex flex-wrap items-center justify-between gap-4 mb-6">
              <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Bộ lọc</span>
              </button>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white px-4 py-2 rounded-lg shadow text-gray-700 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Hiển thị <span className="font-semibold">{filteredQuizzes.length}</span> trong số <span className="font-semibold">{quizzes.length}</span> quiz
              </p>
            </div>

            {/* Quiz Cards */}
            {filteredQuizzes.length > 0 ? (
              <div className="space-y-6">
                {filteredQuizzes.map(quiz => (
                  <QuizCard
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    description={quiz.description}
                    image={quiz.image}
                    questionCount={quiz.questionCount}
                    completions={quiz.completions}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy quiz nào phù hợp</h3>
                <p className="text-gray-600 mb-4">Vui lòng thử thay đổi bộ lọc hoặc quay lại sau.</p>
                <button
                  onClick={() => {
                    setSelectedSort('popular');
                  }}
                  className="bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryQuizzes;