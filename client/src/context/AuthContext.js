import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/api';
import { getToken, setToken, removeToken } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await userService.getMe();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          removeToken();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      setToken(response.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await userService.register(userData);
      setToken(response.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

