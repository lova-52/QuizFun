import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home />}></Route>
        {/* Sau này thêm các route khác ở đây, ví dụ: */}
        {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
      </Routes>
    </Router>
  );
}

export default App;