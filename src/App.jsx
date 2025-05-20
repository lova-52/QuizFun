import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import UserList from './pages/Admin/UserList';
import AddUser from './pages/Admin/AddUser';




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/add" element={<AddUser />} />

        {/* Sau này thêm các route khác ở đây, ví dụ: */}
        {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
      </Routes>
    </Router>
  );
}

export default App;