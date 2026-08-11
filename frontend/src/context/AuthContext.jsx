import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('skillbridge_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('skillbridge_access_token');
    localStorage.removeItem('skillbridge_user');
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('skillbridge_access_token');
      if (token) {
        try {
          const res = await api.get('/user/profile');
          setUser(res.data);
          localStorage.setItem('skillbridge_user', JSON.stringify(res.data));
        } catch (error) {
          console.error("Session verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('skillbridge_access_token', access_token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { access_token, user: userData } = res.data;
    localStorage.setItem('skillbridge_access_token', access_token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google', { credential });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('skillbridge_access_token', access_token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('skillbridge_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        googleLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
