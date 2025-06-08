import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <nav className="mb-6">
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/admin/users"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Quản lý người dùng
            </Link>
          </li>
          {/* Thêm các link khác sau này, ví dụ: Quản lý quiz, categories */}
        </ul>
      </nav>
      <Outlet /> {/* Render các route con như /admin/users */}
    </div>
  );
};

export default AdminDashboard;