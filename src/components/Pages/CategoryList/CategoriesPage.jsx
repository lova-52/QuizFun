import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Home/Navbar/Navbar';
import Footer from '../../Home/Footer/Footer';
import CategoryCard from '../../Home/Categories/CategoryCard';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setCategories(result.data);
        } else {
          throw new Error('Không thể lấy dữ liệu categories');
        }
      } catch (err) {
        console.error('Lỗi khi fetch categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh mục...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    
      {/* Banner/Header */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16 mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Khám phá các chủ đề trắc nghiệm</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Tìm hiểu về bản thân, kiểm tra kiến thức và giải trí với hàng ngàn bài trắc nghiệm đa dạng
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg max-w-md mx-auto">
                <p className="text-sm">Lưu ý: Hiển thị dữ liệu dự phòng do lỗi kết nối</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Danh mục chủ đề</h2>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <div key={category.id}>
                <CategoryCard  
                  id={category.id} 
                  title={category.title} 
                  description={category.description} 
                  image={category.image} 
                  quizCount={category.quizCount} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CategoriesPage;