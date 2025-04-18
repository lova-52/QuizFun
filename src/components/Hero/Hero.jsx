import React from 'react'

const Hero = () => {
  return (
<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-b-3xl mb-12 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="gradient-text">Khám phá bản thân</span> qua trắc nghiệm thú vị
            </h1>
            <p className="text-lg text-gray-600 mb-8">Tham gia các bài trắc nghiệm hấp dẫn để biết thêm về tính cách, sở thích, tiềm năng và kiểm tra kiến thức của bạn.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="bg-secondary hover:bg-darkSecondary text-white text-lg px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bắt đầu ngay
              </a>
              <a href="#" className="bg-white text-primary border border-primary hover:bg-blue-50 text-lg px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tìm hiểu thêm
              </a>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <img src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-971463110.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-971463110.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-971463110.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-971463110.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <p className="ml-4 text-sm text-gray-600">Hơn <span className="font-bold">100,000+</span> người đã tham gia</p>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full opacity-30 filter blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-200 rounded-full opacity-30 filter blur-xl"></div>
              <div className="relative bg-white rounded-xl shadow-xl p-6 z-10 float">
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-2">Trắc nghiệm Tính cách</h3>
                  <div className="bg-gray-100 w-full h-3 rounded-full">
                    <div className="bg-gradient-to-r from-primary to-accent h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Câu hỏi 15/20</p>
                </div>
                <div className="mb-8">
                  <p className="font-medium mb-4">Khi gặp một tình huống khó khăn, bạn thường:</p>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <label className="flex items-center">
                        <input type="radio" name="answer" className="form-radio text-primary" />
                        <span className="ml-2">Phân tích tình huống trước khi quyết định</span>
                      </label>
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <label className="flex items-center">
                        <input type="radio" name="answer" className="form-radio text-primary" />
                        <span className="ml-2">Hỏi ý kiến người khác</span>
                      </label>
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <label className="flex items-center">
                        <input type="radio" name="answer" className="form-radio text-primary" />
                        <span className="ml-2">Tin vào trực giác của bản thân</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Trở lại</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-darkPrimary transition-colors">Tiếp theo</button>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-100 rounded-lg z-0 animate-pulse-slow"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-100 rounded-full z-0 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1.1s' }}></div>
    </section>
  )
}

export default Hero
