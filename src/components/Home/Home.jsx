// Home.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Hero from '../Hero/Hero';
import StatsSection from './Stats/StatsSection';
import PopularQuizzesSection from './PopularQuizzes/PopularQuizzesSection';
import CategoriesSection from './Categories/CategoriesSection';
import Features from './Features/Features';
import Testimonials from './Testimonials/Testimonials';
import CTA from './CTA/CTA';

const Home = () => {
  const { openLogin, openRegister } = useContext(AuthContext);
  
  return (
    <>
      <Hero />
      <StatsSection />
      <CategoriesSection />
      <PopularQuizzesSection />
      <Features />
      <Testimonials />
      <CTA onLoginClick={openLogin} onRegisterClick={openRegister} />
    </>
  );
};

export default Home;