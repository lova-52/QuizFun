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
      // Lưu token vào localStorage để sử dụng cho các request sau
      localStorage.setItem('token', data.token);
      // Lưu user info nếu cần
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
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                {/* SVG icon */}
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              {/* SVG close icon */}
            </button>
          </div>

          {/* Form */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Đăng nhập</h3>
            <p className="text-gray-500 text-sm">Đăng nhập để trải nghiệm QuizFun</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-darkPrimary transition-colors">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản?
              <button onClick={onSwitch} className="text-primary hover:text-darkPrimary font-medium ml-1">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
