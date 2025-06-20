import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.user || parsed;
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken || null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Xóa useEffect vì đã khởi tạo state từ localStorage
  // useEffect(() => {
  //   const savedToken = localStorage.getItem('token');
  //   const savedUser = localStorage.getItem('user');
  //   if (savedToken && savedUser) {
  //     setToken(savedToken);
  //     setUser(JSON.parse(savedUser));
  //   }
  // }, []);

 const login = (data) => {
  const userData = data.user || data;
  const userToken = data.token;
  
  setUser(userData);
  setToken(userToken);
  localStorage.setItem('token', userToken);
  localStorage.setItem('user', JSON.stringify(userData));
};


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const value = {
    user,
    token,
    login,
    logout,
    showLogin,
    showRegister,
    openLogin,
    openRegister,
    closeModals,
    switchToRegister,
    switchToLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
// Thêm custom hook useAuth để truy cập context
export const useAuth = () => useContext(AuthContext);
