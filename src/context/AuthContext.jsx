import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Khởi tạo state từ localStorage ngay khi component mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Hàm đồng bộ user từ localStorage
    const syncUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (!user || JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser);
          console.log('Synced user from localStorage:', parsedUser); // Debug
        }
      } else if (user) {
        setUser(null);
      }
    };

    // Lắng nghe sự thay đổi trong localStorage (từ các tab khác)
    const handleStorageChange = () => syncUserFromLocalStorage();
    window.addEventListener('storage', handleStorageChange);

    // Lắng nghe sự thay đổi URL (bao gồm reload)
    const handleRouteChange = () => syncUserFromLocalStorage();
    window.addEventListener('popstate', handleRouteChange);

    // Kiểm tra ngay lập tức khi URL thay đổi
    syncUserFromLocalStorage(); // Gọi thêm lần nữa để đảm bảo

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user]); // Theo dõi thay đổi của user

  const login = (loginData) => {
    const { token, user: userData } = loginData;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    console.log('Login successful, user:', userData); // Debug
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Sử dụng useMemo để memoize giá trị context, tránh re-render không cần thiết
  const contextValue = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);