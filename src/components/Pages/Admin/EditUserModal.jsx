import React, { useState } from 'react';

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRole === user.role) {
      alert('Role không thay đổi');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdate(user.id, selectedRole);
        alert(`Cập nhật role thành "${selectedRole}" thành công!`);
      } else {
        alert(data.message || 'Cập nhật role thất bại');
      }
    } catch (error) {
      alert('Lỗi khi kết nối đến server');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Chỉnh sửa Role User</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User Info */}
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Tên người dùng:</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Vai trò hiện tại: <span className="capitalize font-semibold text-blue-600">{user.role}</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="user">User (Người dùng thường)</option>
                <option value="admin">Admin (Quản trị viên)</option>
              </select>
              
              {selectedRole !== user.role && (
                <p className="text-sm text-orange-600 mt-1">
                  ⚠️ Bạn đang thay đổi role từ "{user.role}" thành "{selectedRole}"
                </p>
              )}
            </div>

            {/* Warning */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Thay đổi role sẽ ảnh hưởng đến quyền truy cập của người dùng này.
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || selectedRole === user.role}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
