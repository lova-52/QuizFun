import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Đăng nhập thành công!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onClose();
    } else {
      alert(data.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className={`modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? 'active' : ''}`}>
      <div className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">{/* icon close */}</button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email" placeholder="Email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password" placeholder="Mật khẩu" value={password} required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-darkPrimary transition">Đăng nhập</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản? <button onClick={onSwitch} className="text-primary hover:text-darkPrimary font-medium ml-1">Đăng ký ngay</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
