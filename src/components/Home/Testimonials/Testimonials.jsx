import React from 'react';

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 rounded-3xl mb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">Người dùng nói gì</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Đánh giá từ cộng đồng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Khám phá trải nghiệm của những người đã sử dụng QuizFun và cách nó đã giúp họ hiểu rõ hơn về bản thân.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              "
            </div>
            <p className="text-gray-600 mb-6 italic">QuizFun giúp tôi hiểu rõ hơn về tính cách INFP của mình. Các câu hỏi rất sâu sắc và kết quả phân tích chi tiết giúp tôi phát triển bản thân tốt hơn.</p>
            <div className="flex items-center">
              <img src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-971463110.jpg" alt="Nguyễn Văn A" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">Nguyễn Văn A</h4>
                <p className="text-gray-500 text-sm">Sinh viên đại học</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              "
            </div>
            <p className="text-gray-600 mb-6 italic">Tôi đã sử dụng nhiều ứng dụng trắc nghiệm khác nhau, nhưng QuizFun thực sự nổi bật với các chủ đề đa dạng. Đặc biệt là các bài kiểm tra về hướng nghiệp rất hữu ích.</p>
            <div className="flex items-center">
              <img src="https://hips.hearstapps.com/esquireuk.cdnds.net/17/06/1024x1024/square-1486567824-marilyn-monroe.jpg?resize=980:*" alt="Trần Thị B" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">Trần Thị B</h4>
                <p className="text-gray-500 text-sm">Nhân viên văn phòng</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              "
            </div>
            <p className="text-gray-600 mb-6 italic">Tôi sử dụng QuizFun để chuẩn bị cho kỳ thi TOEIC và thật sự ấn tượng với chất lượng câu hỏi. Kết quả thực tế của tôi rất sát với điểm dự đoán từ các bài kiểm tra thử.</p>
            <div className="flex items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05ewxrp16aqdT7co1kU_lUxawEYe7j3OkJg&s" alt="Lê Văn C" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="font-bold">Lê Văn C</h4>
                <p className="text-gray-500 text-sm">Kỹ sư phần mềm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;