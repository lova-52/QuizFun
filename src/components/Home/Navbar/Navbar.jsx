import React from 'react'

const Navbar = () => {
  return (
    <header class="bg-white shadow-md sticky top-0 z-50"> 
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="flex justify-between items-center py-4">
                <a href="#" class="flex items-center space-x-2">
                    <div class="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <span class="text-2xl font-extrabold">
                        <span class="text-primary">Quiz</span><span class="text-secondary">Fun</span>
                    </span>
                </a>
                
                <nav class="hidden md:flex items-center space-x-8">
                    <a href="#" class="font-medium hover:text-primary transition-colors border-b-2 border-primary pb-1">Trang chủ</a>
                    <a href="#" class="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Khám phá</a>
                    <a href="#" class="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Chủ đề</a>
                    <a href="#" class="font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Về chúng tôi</a>
                </nav>
                
                <div class="flex items-center space-x-4">
                    <a href="#" id="loginBtn" class="hidden md:block font-medium text-primary hover:text-darkPrimary transition-colors">Đăng nhập</a>
                    <a href="#" id="registerBtn" class="bg-primary hover:bg-darkPrimary text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Đăng ký
                    </a>
                    
                    <button class="md:hidden text-gray-500 hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar


