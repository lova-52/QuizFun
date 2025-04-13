import React from 'react';

const Navbar = ({ onLoginClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50"> 
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          <a href="#" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="..." />
              </svg>
            </div>
            <span className="text-2xl font-extrabold">
              <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-primary pb-1">Trang chủ</a>
            <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Khám phá</a>
            <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Chủ đề</a>
            <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Về chúng tôi</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Dùng callback onLoginClick */}
            <button onClick={onLoginClick} className="hidden md:block font-medium text-primary hover:text-darkPrimary transition-colors">
              Đăng nhập
            </button>

            {/* Tạm để nút Đăng ký này chưa gắn gì */}
            <a href="#" className="bg-primary hover:bg-darkPrimary text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="..." />
              </svg>
              Đăng ký
            </a>

            <button className="md:hidden text-gray-500 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="..." />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
