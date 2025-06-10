import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Quizzes from './components/Pages/QuizList/Quizzes';
import CategoriesPage from './components/Pages/CategoryList/CategoriesPage';
import QuizzDetail from './components/Pages/QuizzDetail';
import QuizzTake from './components/Pages/QuizzTake';
import QuizResult from './components/Pages/QuizResult';
import UserList from './components/Pages/Admin/UserList';
import Layout from './components/Layout/layout';

import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/Auth/LoginModal';
import { AuthProvider } from './context/AuthContext';

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

          {/* Trang làm bài - không hiển thị footer */}
          <Route
            path="/quiz/:quizId/take"
            element={
              <Layout showFooter={false} showNavbar={false}>
                <QuizzTake />
              </Layout>
            }
          />


          <Route path="/quiz/:quizId/result" element={
            <Layout>
              <QuizResult />
            </Layout>
          } />

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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;