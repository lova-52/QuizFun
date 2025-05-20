// src/pages/Admin/UserList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const users = [
  { id: 1, name: 'Nguyễn Văn Nam', email: 'nam@gmail.com', role: 'admin' },
  { id: 2, name: 'Trần Ngọc Long', email: 'long@gmail.com', role: 'admin' },
  { id: 3, name: 'Trần Nghĩa', email: 'nghia@gmail.com', role: 'user' },
];

const UserList = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách người dùng</h2>
        <button
          onClick={() => navigate('/admin/users/add')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Thêm người dùng
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Quyền</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">Sửa</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
