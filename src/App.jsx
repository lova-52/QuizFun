import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Quizzes from './components/Pages/QuizList/Quizzes';
import CategoriesPage from './components/Pages/CategoryList/CategoriesPage';
import QuizzDetail from './components/Pages/QuizzDetail';
import QuizzTake from './components/Pages/QuizzTake';
import AboutUs from './components/Pages/AboutUs';
import UserList from './components/Pages/Admin/UserList';
import Layout from './components/Layout/layout';
import QuizResult from './components/Pages/QuizResult';

import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import QuizManagement from './components/Pages/Admin/QuizManagement';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/Auth/LoginModal';
import { AuthProvider } from './context/AuthContext';

import Profile from './components/Pages/Profile';
import MyQuizzes from './components/Pages/MyQuizzes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Trang có đầy đủ navbar + footer */}
          <Route path='/' exact element={
            <Layout>
              <Home />
            </Layout>
          } />

          <Route path="/about" element={
            <Layout>
              <AboutUs />
            </Layout>
          } />

          <Route path="/category/:categoryId" element={
            <Layout>
              <Quizzes />
            </Layout>
          } />

          <Route path="/categories" element={
            <Layout>
              <CategoriesPage />
            </Layout>
          } />

          <Route path="/quiz/:quizId" element={
            <Layout>
              <QuizzDetail />
            </Layout>
          } />

          {/* Trang làm bài - cần đăng nhập */}
          <Route
            path="/quiz/:quizId/take"
            element={
              <ProtectedRoute redirectTo="/quiz/:quizId">
                <Layout showFooter={false} showNavbar={false}>
                  <QuizzTake />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Trang kết quả - cần đăng nhập và có dữ liệu kết quả */}
          <Route
            path="/quiz/:quizId/result"
            element={
              <ProtectedRoute redirectTo="/quiz/:quizId" requireQuizResult={true}>
                <Layout>
                  <QuizResult />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <QuizManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Các route profile cũng cần đăng nhập */}
          <Route path="/profile" element={
            <ProtectedRoute redirectTo="/">
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/my-quizzes" element={
            <ProtectedRoute redirectTo="/">
              <Layout>
                <MyQuizzes />
              </Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
