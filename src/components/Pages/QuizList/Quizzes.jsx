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

  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');

  // Sort và filter options
  const difficulties = ['Dễ', 'Trung bình', 'Khó'];
  const sortOptions = [
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'a-z', label: 'Tên A-Z' },
    { value: 'z-a', label: 'Tên Z-A' },
  ];

  // Mock data 
  useEffect(() => {
    const mockCategories = [
      {
        id: "1",
        title: "Tính cách",
        description: "Khám phá những điều thú vị về tính cách của bạn",
        image: "https://images.careerviet.vn/content/images/tinh-cach-la-gi-careerbuilder-5.png",
      },
      {
        id: "2",
        title: "Sở thích",
        description: "Tìm hiểu sở thích phù hợp với bạn",
        image: "https://goga.ai/wp-content/uploads/2022/10/gioi-thieu-so-thich-bang-tieng-anh-4-1.png",
      },
      {
        id: "3",
        title: "Giải trí",
        description: "Thư giãn với những câu đố vui nhộn",
        image: "https://etimg.etb2bimg.com/photo/81478822.cms",
      },
      {
        id: "4",
        title: "Học tập",
        description: "Kiểm tra kiến thức với các bài thi thử",
        image: "https://dhannd.edu.vn/image/cache/catalog/00_hinh_anh/p_6/210630_1.bia-900x600.jpeg",
      }
    ];

    const mockQuizzes = [
      {
        id: '1',
        categoryId: '1',
        title: 'Bạn thuộc nhóm tính cách nào?',
        description: 'Khám phá bạn thuộc nhóm tính cách MBTI nào qua 20 câu hỏi đơn giản',
        image: 'https://www.verywellmind.com/thmb/uwCfX7jYs3W2U5lc6S5vJ25XPCY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2795284-00-MBTI-typing-system-and-the-types_V1-c7d2798146ae4f2cbe0fb767118eb89e.jpg',
        difficulty: 'Dễ',
        questionCount: 20,
        completions: 15240,
        createdAt: '2023-09-15'
      },
      {
        id: '2',
        categoryId: '1',
        title: 'Phong cách làm việc của bạn',
        description: 'Tìm hiểu phong cách làm việc và cách phối hợp với đồng nghiệp hiệu quả',
        image: 'https://www.ntaskmanager.com/wp-content/uploads/2019/07/3.png',
        difficulty: 'Trung bình',
        questionCount: 15,
        completions: 8920,
        createdAt: '2023-10-02'
      },
      {
        id: '3',
        categoryId: '1',
        title: 'Khám phá điểm mạnh tiềm ẩn',
        description: 'Tìm ra những điểm mạnh tiềm ẩn mà bạn có thể chưa nhận ra về bản thân',
        image: 'https://cdn.pixabay.com/photo/2022/01/11/21/48/light-bulb-6931911_1280.jpg',
        difficulty: 'Khó',
        questionCount: 25,
        completions: 6450,
        createdAt: '2023-11-10'
      },
      {
        id: '4',
        categoryId: '1',
        title: 'Bạn xử lý stress như thế nào?',
        description: 'Hiểu rõ cách bạn phản ứng với stress và áp lực trong cuộc sống',
        image: 'https://cdn.pixabay.com/photo/2020/11/08/11/22/man-5723449_1280.jpg',
        difficulty: 'Trung bình',
        questionCount: 18,
        completions: 10320,
        createdAt: '2023-12-05'
      },
      {
        id: '5',
        categoryId: '1',
        title: 'Phong cách giao tiếp của bạn',
        description: 'Tìm hiểu cách bạn giao tiếp và tương tác với người khác',
        image: 'https://cdn.pixabay.com/photo/2019/11/04/10/11/network-4600870_1280.jpg',
        difficulty: 'Dễ',
        questionCount: 15,
        completions: 9750,
        createdAt: '2024-01-20'
      },
      {
        id: '6',
        categoryId: '1',
        title: 'Chỉ số EQ của bạn',
        description: 'Đánh giá chỉ số cảm xúc và khả năng đồng cảm của bạn',
        image: 'https://cdn.pixabay.com/photo/2018/03/09/08/05/woman-3210837_1280.jpg',
        difficulty: 'Khó',
        questionCount: 30,
        completions: 7680,
        createdAt: '2024-02-15'
      },
    ];

    setTimeout(() => {
      // Tìm thông tin category dựa trên categoryId
      const foundCategory = mockCategories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);

      // Lọc danh sách quiz theo categoryId
      const categoryQuizzes = mockQuizzes.filter(quiz => quiz.categoryId === categoryId);
      setQuizzes(categoryQuizzes);
      setFilteredQuizzes(categoryQuizzes);
      setLoading(false);
    }, 500); // giả lập delay API

  }, [categoryId]);

  // Apply filters khi các state filter thay đổi
  useEffect(() => {
    let result = [...quizzes];

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(quiz => quiz.difficulty === selectedDifficulty);
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
        result.sort((a, b) => b.completions - a.completions);
        break;
    }

    setFilteredQuizzes(result);
  }, [quizzes, selectedDifficulty, selectedSort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-7xl flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy chủ đề này</h2>
            <p className="mt-2 text-gray-600">Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="mt-6 inline-block bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Quay về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
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
                    difficulty={quiz.difficulty}
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
                    setSelectedDifficulty('all');
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

      <Footer />
    </div>
  );
}

export default CategoryQuizzes; 