import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center mb-2">
            <a href="#" className="flex items-center space-x-2 mb-1">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold">
                <span className="text-primary">Quiz</span><span className="text-secondary">Fun</span>
              </span>
            </a>
            <p className="text-gray-400 mb-1 max-w-2xl">Nền tảng trắc nghiệm trực tuyến hàng đầu Việt Nam với đa dạng chủ đề và bài kiểm tra chất lượng cao.</p>
          </div>

          <div className="border-t border-gray-800 pt-2">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-1 md:mb-0">© 2025 QuizFun. Tất cả các quyền được bảo lưu.</p>
              <div className="flex space-x-6">
                <span className="text-gray-400 text-sm">contact@quizfun.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer