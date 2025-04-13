import { useState } from 'react';
import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Hero from '../Hero/Hero';
import LoginModal from '../Auth/LoginModal';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false); // ✅ hook đúng chỗ

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)}/>
      <Hero />
      <button onClick={() => setShowLogin(true)} className="btn">Đăng nhasdập</button>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => setShowLogin(false)} //or showRegister()
      />
      <Footer />
    </>
  );
};

export default Home;
