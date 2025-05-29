import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLoginClick, onRegisterClick, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setUserDropdownOpen(false);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <Link to="/" onClick={handleNavClick} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold">
                <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" onClick={handleNavClick} className="font-medium hover:text-primary transition-colors border-b-2 border-primary pb-1">Trang chủ</Link>
              <Link to="/explore" onClick={handleNavClick} className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Khám phá</Link>
              <Link to="/topics" onClick={handleNavClick} className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Chủ đề</Link>
              <Link to="/about" onClick={handleNavClick} className="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Về chúng tôi</Link>
            </nav>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                // User logged in - show user menu
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-700 hidden md:block">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          {user.name || 'Người dùng'}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        onClick={() => {
                          handleNavClick();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Thông tin cá nhân
                      </Link>
                      
                      <Link 
                        to="/my-quizzes" 
                        onClick={() => {
                          handleNavClick();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Quiz của tôi
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // User not logged in - show login/register buttons
                <>
                  <button onClick={onLoginClick} className="hidden md:block font-medium text-primary hover:text-darkPrimary transition-colors">Đăng nhập</button>
                  <button onClick={onRegisterClick} className="bg-primary hover:bg-darkPrimary text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Đăng ký
                  </button>
                </>
              )}
              
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
            <Link to="/" className="font-medium py-2 px-4 rounded bg-blue-50 text-primary">Trang chủ</Link>
            <Link to="/explore" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Khám phá</Link>
            <Link to="/topics" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Chủ đề</Link>
            <Link to="/about" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Về chúng tôi</Link>
            <hr className="my-2" />
            
            {user ? (
              // Mobile user menu
              <>
                <div className="py-2 px-4">
                  <p className="font-medium text-gray-800">{user.name || user.email.split('@')[0]}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link to="/profile" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Thông tin cá nhân</Link>
                <Link to="/my-quizzes" className="font-medium py-2 px-4 rounded hover:bg-blue-50 hover:text-primary transition-colors">Quiz của tôi</Link>
                <button onClick={handleLogout} className="font-medium py-2 px-4 rounded text-red-600 hover:bg-red-50 transition-colors text-left">Đăng xuất</button>
              </>
            ) : (
              // Mobile login button
              <button onClick={onLoginClick} className="font-medium py-2 px-4 rounded text-primary hover:bg-blue-50 transition-colors text-left">Đăng nhập</button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;