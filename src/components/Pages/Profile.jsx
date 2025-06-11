import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`);
      const data = await response.json();
      if (data.success) {
        setUserInfo(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Đổi mật khẩu thành công!');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
      
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Tên hiển thị</label>
            <div className="bg-gray-50 p-3 rounded">{userInfo?.name || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="bg-gray-50 p-3 rounded">{userInfo?.email || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Vai trò</label>
            <div className="bg-gray-50 p-3 rounded capitalize">{userInfo?.role || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Ngày tham gia</label>
            <div className="bg-gray-50 p-3 rounded">
              {userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString('vi-VN') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{userInfo?.totalQuizzes || 0}</div>
            <div className="text-blue-800">Quiz đã làm</div>
          </div>
          <div className="text-center bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{userInfo?.completedQuizzes || 0}</div>
            <div className="text-green-800">Quiz hoàn thành</div>
          </div>
          <div className="text-center bg-purple-50 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600">{userInfo?.avgScore || 0}%</div>
            <div className="text-purple-800">Điểm trung bình</div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bảo mật</h2>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showChangePassword ? 'Hủy' : 'Đổi mật khẩu'}
          </button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
