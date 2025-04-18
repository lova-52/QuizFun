import React, { useState } from 'react';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold">
                <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
              </span>
            </a>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-primary pb-1">Trang chủ</a>
              <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Khám phá</a>
              <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Chủ đề</a>
              <a href="#" className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Về chúng tôi</a>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={onLoginClick} className="hidden md:block font-medium text-primary hover:text-darkPrimary transition-colors">Đăng nhập</button>
              <button onClick={onRegisterClick} className="bg-primary hover:bg-darkPrimary text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Đăng ký
              </button>
              
              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="md:hidden text-gray-500 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white shadow-lg absolute z-40 w-full ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="font-medium py-2 px-4 rounded bg-blue-50 text-primary">Trang chủ</a>
            <a href="#" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Khám phá</a>
            <a href="#" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Chủ đề</a>
            <a href="#" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Về chúng tôi</a>
            <hr className="my-2" />
            <button onClick={onLoginClick} className="font-medium py-2 px-4 rounded text-primary hover:bg-blue-50 transition-colors text-left">Đăng nhập</button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;