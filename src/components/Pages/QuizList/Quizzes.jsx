import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');

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

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
  }, [quizzes, selectedSort, searchTerm]);

  const resetFilters = () => {
    setSelectedSort('popular');
    setSearchTerm('');
  };

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
          {/* Desktop Sidebar Filters */}
          <div className="lg:w-1/4 hidden lg:block">
            <FilterSidebar
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resetFilters={resetFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Mobile Search and Sort */}
            <div className="lg:hidden space-y-4 mb-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm quiz..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full bg-white px-3 py-2.5 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <p className="text-gray-600 text-sm sm:text-base">
                Hiển thị <span className="font-semibold">{filteredQuizzes.length}</span> trong số <span className="font-semibold">{quizzes.length}</span> quiz
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-500">
                  Kết quả cho: "<span className="font-medium">{searchTerm}</span>"
                </p>
              )}
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {searchTerm ? 'Không tìm thấy quiz nào phù hợp' : 'Không có quiz nào'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `Không tìm thấy quiz nào chứa từ khóa "${searchTerm}". Vui lòng thử từ khóa khác.`
                    : 'Vui lòng thử thay đổi bộ lọc hoặc quay lại sau.'
                  }
                </p>
                <button
                  onClick={resetFilters}
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