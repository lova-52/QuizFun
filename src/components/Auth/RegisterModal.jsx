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
      headers: {
        'Content-Type': 'application/json'
      },
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

  // Không dùng return null nữa
  return (
    <div className={`modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? 'active' : ''}`}>
      <div className="modal-content bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Modal Header with Close Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Register Form */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Đăng ký tài khoản</h3>
            <p className="text-gray-500 text-sm">Tham gia cùng QuizFun ngay hôm nay</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input 
                type="text" 
                id="register-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="register-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                id="register-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                placeholder="Tạo mật khẩu"
                required
              />
            </div>
            
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                id="register-confirm-password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-darkPrimary text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Đăng ký
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản? 
              <button onClick={onSwitch} className="text-primary hover:text-darkPrimary font-medium ml-1">
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}