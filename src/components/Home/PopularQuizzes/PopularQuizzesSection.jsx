import React from 'react';
import QuizCard from './QuizCard';

function PopularQuizzesSection() {
  const quizzes = [
    {
      id: 1,
      title: "MBTI Test",
      category: "Tính cách",
      categoryColor: "blue",
      image: "https://mir-s3-cdn-cf.behance.net/project_modules/source/98c7d714515857.5628564df0349.jpg",
      badge: { text: "Hot", color: "yellow-500" },
      duration: "10 phút",
      questionCount: "70 câu hỏi",
      rating: "4.9",
      description: "Khám phá 16 kiểu tính cách MBTI và tìm hiểu bạn thuộc nhóm nào.",
      userCount: "+3k"
    },
    {
      id: 2,
      title: "IQ Test",
      category: "Trí tuệ",
      categoryColor: "green",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgueNC9j2JgpIrZDoh33IP7Z_-LQ2kQl032Q1KVaSIMx61ocKi6eR7_1Ex0XQOZfhyX0&usqp=CAU",
      badge: { text: "Mới", color: "indigo-500" },
      duration: "15 phút",
      questionCount: "40 câu hỏi",
      rating: "4.7",
      description: "Đánh giá chỉ số thông minh IQ với các câu đố logic và tư duy.",
      userCount: "+2k"
    },
    {
      id: 3,
      title: "EQ Test",
      category: "Cảm xúc",
      categoryColor: "purple",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgeimc73JMBXiIUElsvMVdWtR6gSDarWk6OC-ixlaHMorATdmpnJmWBgzomAuuWmhq1fU&usqp=CAU",
      badge: { text: "Phổ biến", color: "purple-500" },
      duration: "12 phút",
      questionCount: "35 câu hỏi",
      rating: "4.8",
      description: "Đánh giá chỉ số cảm xúc EQ và khả năng đồng cảm của bạn.",
      userCount: "+1.5k"
    }
  ];

  return (
    <section className="bg-white py-16 rounded-3xl mb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Trải nghiệm ngay</p>
            <h2 className="text-3xl font-bold text-gray-800">Trắc nghiệm phổ biến</h2>
          </div>
          <div className="hidden md:flex space-x-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors" id="prev-quiz">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors" id="next-quiz">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 text-center">
          <a href="#" className="inline-flex items-center text-primary hover:text-darkPrimary transition-colors font-medium">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default PopularQuizzesSection;