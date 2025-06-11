import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Quản lý người dùng */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Quản lý người dùng</h2>
            <p className="text-gray-600">Xem và chỉnh sửa danh sách người dùng.</p>
            <Link
              to="/admin/users"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium"
            >
              Đi tới →
            </Link>
          </div>
          {/* Card Quản lý Quiz */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Quản lý Quiz</h2>
            <p className="text-gray-600">Quản lý các bài quiz và danh mục.</p>
            <Link
              to="/admin/quizzes"
              className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium"
            >
              Đi tới →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
//test

export default AdminDashboard;
