import React, { useEffect, useState } from 'react';
import EditUserModal from './EditUserModal';
import UserStatisticsModal from './UserStatisticsModal'; // ← THÊM IMPORT

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false); // ← THÊM STATE
  const [viewingUserId, setViewingUserId] = useState(null); // ← THÊM STATE

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

  const handleView = (userId) => {
    setViewingUserId(userId);
    setShowStatsModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản với ID: ${userId}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(user => user.id !== userId));
          setError(null);
        } else {
          setError(data.message || 'Xóa tài khoản thất bại');
        }
      } catch (err) {
        setError('Lỗi khi kết nối đến server');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    ));
    setShowEditModal(false);
    setEditingUser(null);
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
              <td className="px-4 py-2">
                <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <button 
                  onClick={() => handleEdit(user)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Sửa
                </button>
                <button
                  className="text-red-500 hover:text-red-700 mr-4"
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </button>
                {/* ← SỬA BUTTON XEM */}
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

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* ← THÊM STATISTICS MODAL */}
      {showStatsModal && viewingUserId && (
        <UserStatisticsModal
          userId={viewingUserId}
          onClose={() => {
            setShowStatsModal(false);
            setViewingUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default UserList;
