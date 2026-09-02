import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('craftlink_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage read restricted:', e);
    }
    return null; // ✅ FIX: No hardcoded default user — user must login
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('craftlink_token') || null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('craftlink_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('craftlink_user');
      }
    } catch (e) {
      console.warn('Storage write restricted:', e);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('craftlink_token', res.data.token);
      localStorage.setItem('craftlink_user', JSON.stringify(res.data.user));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('craftlink_token', res.data.token);
      localStorage.setItem('craftlink_user', JSON.stringify(res.data.user));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    setLoading(true);
    try {
      const res = await authApi.demoLogin(role);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('craftlink_token', res.data.token);
      localStorage.setItem('craftlink_user', JSON.stringify(res.data.user));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: loginWithOtp — used by OTPAuthPage instead of setUser/setToken directly
  const loginWithOtp = async (identifier, otp, role, name) => {
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ identifier, otp, role, name });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('craftlink_token', res.data.token);
      localStorage.setItem('craftlink_user', JSON.stringify(res.data.user));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('craftlink_user');
    localStorage.removeItem('craftlink_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      demoLogin,
      loginWithOtp,
      logout,
      // ✅ FIX: expose setUser and setToken for any direct usage
      setUser,
      setToken,
      isArtisan: user?.role === 'artisan',
      isBuyer: user?.role === 'buyer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
