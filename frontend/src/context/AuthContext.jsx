import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const toastId = toast.loading('Signing in...');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      toast.success('Logged in successfully!', { id: toastId });
      return true;
    } catch (error) {
      if (error.response?.status === 403) {
         toast.error('Please verify your email first!', { id: toastId });
         return { requiresVerification: true };
      }
      toast.error(error.response?.data?.message || 'Login failed', { id: toastId });
      return false;
    }
  };

  const register = async (name, email, password) => {
    const toastId = toast.loading('Creating account...');
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful. Please check your email for OTP.', { id: toastId });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed', { id: toastId });
      return false;
    }
  };

  const verifyEmail = async (email, otp) => {
    const toastId = toast.loading('Verifying OTP...');
    try {
      const res = await api.post('/auth/verify-email', { email, otp });
      toast.success('Email verified successfully! Please log in.', { id: toastId });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed', { id: toastId });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
