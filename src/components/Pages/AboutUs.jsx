import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Founder & CEO",
      description: "Với hơn 5 năm kinh nghiệm trong lĩnh vực giáo dục và công nghệ, A đã khởi xướng ý tưởng tạo ra QuizFun để mang đến trải nghiệm học tập thú vị.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      skills: ["Leadership", "Product Strategy", "Education Tech"]
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Lead Developer",
      description: "Chuyên gia phát triển full-stack với đam mê tạo ra những sản phẩm công nghệ chất lượng cao. B chịu trách nhiệm về toàn bộ hạ tầng kỹ thuật của QuizFun.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      skills: ["React", "Node.js", "Database Design"]
    },
    {
      id: 3,
      name: "Phạm Văn C",
      role: "UI/UX Designer",
      description: "Nghệ sĩ thiết kế với tài năng biến những ý tưởng phức tạp thành giao diện đơn giản, thân thiện. C đảm bảo QuizFun luôn mang đến trải nghiệm người dùng tuyệt vời.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      skills: ["UI Design", "UX Research", "Prototyping"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Về <span className="text-yellow-300">QuizFun</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là một nhóm những người đam mê giáo dục và công nghệ, 
            với sứ mệnh biến việc học tập thành một hành trình thú vị và đầy cảm hứng.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                QuizFun ra đời với mong muốn tạo ra một nền tảng học tập tương tác, 
                nơi mọi người có thể khám phá kiến thức mới một cách thú vị và hiệu quả. 
                Chúng tôi tin rằng học tập không chỉ là việc ghi nhớ thông tin, 
                mà còn là quá trình khám phá và phát triển bản thân.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Thông qua các bài quiz đa dạng và phong phú, chúng tôi mong muốn 
                giúp người dùng không chỉ kiểm tra kiến thức mà còn mở rộng 
                tầm hiểu biết về thế giới xung quanh.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Team collaboration" 
                className="relative rounded-3xl shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Gặp gỡ những con người tài năng đã cùng nhau xây dựng nên QuizFun
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-600/20 group-hover:ring-blue-600/40 transition-all"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                </div>
                
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {member.description}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp từ cộng đồng để không ngừng cải thiện QuizFun
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-blue-600 font-medium">contact@quizfun.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Thời gian phản hồi</h3>
                    <p className="text-gray-600">Trong vòng 24 giờ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop" 
                alt="Contact us" 
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;