import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  
  const login = (newToken, redirectTo = '/profile') => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{token, isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
  
}

export const useAuth = () => useContext(AuthContext);
