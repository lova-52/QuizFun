import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';

function PopularQuizzesSection() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/popular-quizzes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log('API response:', result.data);
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

  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-12 lg:py-16 rounded-3xl mb-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-6 sm:mb-10">
            <div>
              <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-2">Trải nghiệm ngay</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Trắc nghiệm phổ biến</h2>
            </div>
          </div>

          {/* Desktop loading: Grid layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-56 rounded-2xl"></div>
            ))}
          </div>

          {/* Mobile loading: Horizontal scroll */}
          <div className="sm:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-2xl flex-none w-[75vw] max-w-[300px] snap-start"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16 rounded-3xl mb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-6 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-2">Trải nghiệm ngay</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Trắc nghiệm phổ biến</h2>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex-none w-[75vw] max-w-[300px] snap-start"
              >
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS để ẩn scrollbar */}
      <style jsx>{`|css
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

export default PopularQuizzesSection;