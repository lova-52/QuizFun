import { useState } from 'react';

export default function RegisterModal({ isOpen, onClose, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Đăng ký thành công!');
      onClose();
    } else {
      alert(data.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className={`modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? 'active' : ''}`}>
      <div className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              {/* icon close */}
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <input
              type="text" placeholder="Họ và tên" value={name} required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
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
            <input
              type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-darkPrimary transition">Đăng ký</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản? <button onClick={onSwitch} className="text-primary hover:text-darkPrimary font-medium ml-1">Đăng nhập ngay</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
