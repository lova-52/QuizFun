import { useState } from 'react';
import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Hero from '../Hero/Hero';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal'; // 👈 Thêm dòng này
import StatsSection from './Stats/StatsSection';
import PopularQuizzesSection from './PopularQuizzes/PopularQuizzesSection';
import CategoriesSection from './Categories/CategoriesSection';
import Features from './Features/Features';
import Testimonials from './Testimonials/Testimonials';
import CTA from './CTA/CTA';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // 👈 Thêm state này

  return (
    <>
      <Navbar 
        onLoginClick={() => {
          console.log('Login clicked');
          setShowLogin(true);
          setShowRegister(false); // đảm bảo chỉ mở một modal
        }}
        onRegisterClick={() => {
          setShowRegister(true);
          setShowLogin(false); // đảm bảo chỉ mở một modal
        }}
      />

      <Hero />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
      <StatsSection />
      <CategoriesSection />
      <PopularQuizzesSection />
      <Features />
      <Testimonials />
      <CTA />

      <Footer />
    </>
  );
};

export default Home;
