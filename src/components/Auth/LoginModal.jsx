import { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Đăng nhập thành công!');
      // Lưu token sau này vào localStorage nếu có
      onClose();
    } else {
      alert(data.message || 'Đăng nhập thất bại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Đăng nhập</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button type="submit" className="bg-primary text-white w-full py-2 rounded-lg">Đăng nhập</button>
          </form>

          <div className="mt-4 text-center">
            <p>
              Chưa có tài khoản?{' '}
              <button onClick={onSwitch} className="text-primary font-medium">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
