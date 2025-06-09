import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError('Có lỗi xảy ra khi lấy danh sách người dùng');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi kết nối đến server');
        setLoading(false);
      });
  }, []);

  // Thêm hàm xử lý sự kiện cho nút Xem
  // TODO: Thay bằng logic gọi API hoặc chuyển hướng đến trang kết quả
  const handleView = (userId) => {
    console.log(`Xem kết quả của người dùng với ID: ${userId}`);
    // Ví dụ: Chuyển hướng đến trang kết quả: window.location.href = `/admin/user/${userId}/results`;
    // Hoặc gọi API: fetch(`http://localhost:5000/api/user/${userId}/results`)
  };

  if (loading) return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách User</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Vai trò</th>
            <th className="px-4 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2 text-center">
                <button className="text-blue-500 hover:text-blue-700 mr-4">
                  Sửa
                </button>
                <button className="text-red-500 hover:text-red-700 mr-4">
                  Xóa
                </button>
                {/* Thêm nút Xem để xem kết quả của người chơi */}
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleView(user.id)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;