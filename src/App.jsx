import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
<<<<<<< HEAD
import UserList from './pages/Admin/UserList';
import AddUser from './pages/Admin/AddUser';


=======
import Quizzes from './components/Pages/QuizList/Quizzes';
import CategoriesPage from './components/Pages/CategoryList/CategoriesPage';
>>>>>>> 93cb24e39b37598ce302f2646ebf00c1543b47d4


const App = () => {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path='/' element={<Home />}></Route>
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/add" element={<AddUser />} />

=======
        <Route path='/' exact element={<Home />}></Route>
         <Route path="/category/:categoryId" element={<Quizzes />} />
          <Route path="/categories" element={<CategoriesPage />} />
>>>>>>> 93cb24e39b37598ce302f2646ebf00c1543b47d4
        {/* Sau này thêm các route khác ở đây, ví dụ: */}
        {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
      </Routes>
    </Router>
  );
}

export default App;