import React from 'react';

const Features = () => {
  return (
    <section className="bg-gray-50 py-16 rounded-3xl mb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Tại sao chọn QuizFun</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Trải nghiệm trắc nghiệm trực tuyến hiện đại với các tính năng tiên tiến giúp bạn khám phá bản thân và nâng cao kiến thức.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Trắc nghiệm cá nhân hóa</h3>
            <p className="text-gray-600 mb-4">Hệ thống trắc nghiệm thông minh với thuật toán phân tích giúp đưa ra kết quả chính xác và phù hợp với từng cá nhân.</p>
            
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Theo dõi tiến độ</h3>
            <p className="text-gray-600 mb-4">Chức năng theo dõi sự tiến bộ giúp bạn dễ dàng xem lại lịch sử và kết quả các bài trắc nghiệm đã làm.</p>
            
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Phân tích chi tiết</h3>
            <p className="text-gray-600 mb-4">Nhận báo cáo chi tiết về kết quả và đề xuất cải thiện dựa trên phân tích câu trả lời của bạn.</p>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;