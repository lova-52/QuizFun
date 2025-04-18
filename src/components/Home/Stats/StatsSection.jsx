import React from 'react';

function StatsSection() {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">100+</h3>
            <p className="text-gray-600">Bài trắc nghiệm</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">50k+</h3>
            <p className="text-gray-600">Người dùng</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">20+</h3>
            <p className="text-gray-600">Chủ đề khác nhau</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">99%</h3>
            <p className="text-gray-600">Đánh giá tích cực</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;