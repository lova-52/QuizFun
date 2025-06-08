// components/Home/Home.js
import React from 'react';
import Hero from '../Hero/Hero';
import StatsSection from './Stats/StatsSection';
import PopularQuizzesSection from './PopularQuizzes/PopularQuizzesSection';
import CategoriesSection from './Categories/CategoriesSection';
import Features from './Features/Features';
import Testimonials from './Testimonials/Testimonials';
import CTA from './CTA/CTA';

const Home = () => {
  
  return (
    <>
      <Hero />
      <StatsSection />
      <CategoriesSection />
      <PopularQuizzesSection />
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;