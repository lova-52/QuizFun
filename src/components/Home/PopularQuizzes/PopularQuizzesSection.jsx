import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';

function PopularQuizzesSection() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 400; // Chiều rộng cố định của card
  const cardGap = 16; // Khoảng cách giữa các card (space-x-4 = 16px)

  // Xác định số card hiển thị dựa trên kích thước màn hình
  const getVisibleCards = () => {
    const screenWidth = window.innerWidth;
    const containerPadding = 32; // px-4 ở container (16px mỗi bên)
    const availableWidth = screenWidth - containerPadding;
    
    // Tính số card tối đa có thể hiển thị
    const maxCards = Math.floor((availableWidth + cardGap) / (cardWidth + cardGap));
    
    // Giới hạn tối đa 3 card trên desktop
    return Math.min(maxCards, 3);
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  // Cập nhật số card khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      const newVisibleCards = getVisibleCards();
      setVisibleCards(newVisibleCards);
      // Đảm bảo currentIndex không vượt quá giới hạn
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, quizzes.length - newVisibleCards)));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [quizzes]);

  // Fetch top 6 popular quizzes from API
  useEffect(() => {
    const fetchPopularQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/popular-quizzes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success) {
          const topQuizzes = result.data.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            image: quiz.image,
            completions: quiz.completions
          }));
          setQuizzes(topQuizzes);
        } else {
          throw new Error('Không thể lấy dữ liệu quizzes');
        }
      } catch (err) {
        console.error('Lỗi khi fetch quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularQuizzes();
  }, []);

  // Xử lý chuyển slide với vòng lặp
  const handlePrev = () => {
    const maxIndex = Math.max(0, quizzes.length - visibleCards);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, quizzes.length - visibleCards);
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Kiểm tra xem có cần hiển thị nút điều hướng không
  const showNavigation = quizzes.length > visibleCards;

  if (loading) {
    return (
      <section className="bg-white py-16 rounded-3xl mb-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Trải nghiệm ngay</p>
              <h2 className="text-3xl font-bold text-gray-800">Trắc nghiệm phổ biến</h2>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-56 rounded-2xl flex-shrink-0" style={{ width: `${cardWidth}px` }}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 rounded-3xl mb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Trải nghiệm ngay</p>
            <h2 className="text-3xl font-bold text-gray-800">Trắc nghiệm phổ biến</h2>
          </div>
          {showNavigation && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className="overflow-hidden">
          <div
            className="flex space-x-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (cardWidth + cardGap)}px)` }}
          >
            {quizzes.map(quiz => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularQuizzesSection;