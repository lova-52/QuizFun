// components/Layout/Layout.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Home/Navbar/Navbar';
import Footer from '../Home/Footer/Footer';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';

const Layout = ({ children, showFooter = true }) => {
  const {
    user,
    logout,
    showLogin,
    showRegister,
    openLogin,
    openRegister,
    closeModals,
    switchToRegister,
    switchToLogin,
  } = useContext(AuthContext);

  return (
    <>
      {/* Navbar luôn hiển thị */}
      <Navbar
        user={user}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
        onLogout={logout}
      />

      {/* Nội dung chính của từng trang */}
      <main>
        {children}
      </main>

      {/* Footer (có thể tắt cho một số trang) */}
      {showFooter && <Footer />}

      {/* Modals - sẽ hiển thị trên mọi trang */}
      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitch={switchToRegister}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={closeModals}
        onSwitch={switchToLogin}
      />
    </>
  );
};

export default Layout;