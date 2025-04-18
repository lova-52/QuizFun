import React from 'react';

const CTA = () => {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">Sẵn sàng khám phá bản thân?</h2>
              <p className="text-blue-100 mb-8">Đăng ký miễn phí ngay hôm nay và bắt đầu hành trình khám phá bản thân thông qua các bài trắc nghiệm thú vị.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="bg-white text-primary hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Đăng ký miễn phí
                </a>
                <a href="#" className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Đăng nhập
                </a>
              </div>
            </div>
            <div className="relative hidden md:flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-30 filter blur-xl"></div>
              <img src="https://blog.wingfox.com/wp-content/uploads/2022/01/graffiti-illustration.png" alt="QuizFun illustration" className="relative z-10 max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;