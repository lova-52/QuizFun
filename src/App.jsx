import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Quizzes from './components/Pages/QuizList/Quizzes';
import CategoriesPage from './components/Pages/CategoryList/CategoriesPage';
import QuizzDetail from './components/Pages/QuizzDetail';
import QuizzTake from './components/Pages/QuizzTake';
import QuizResult from './components/Pages/QuizResult';
import UserList from './components/Pages/Admin/UserList';
import AdminDashboard from './components/Pages/Admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/Auth/LoginModal'; // Import LoginModal

import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/category/:categoryId" element={<Quizzes />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/quiz/:quizId" element={<QuizzDetail />} />
          <Route path="/quiz/:quizId/take" element={<QuizzTake />} />
          <Route path="/quiz/:quizId/result" element={<QuizResult />} />
          <Route path="/login" element={<LoginModal />} /> {/* Thêm route cho /login */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;