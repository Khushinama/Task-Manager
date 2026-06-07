import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    else setErrors(prev => ({ ...prev, email: null }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const pwdError = validatePassword(val);
    if (pwdError) setErrors(prev => ({ ...prev, password: pwdError }));
    else setErrors(prev => ({ ...prev, password: null }));
  };

  const validateAll = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    
    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const result = await login(email, password);
    if (result === true) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[80vh]"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">TaskFlow</h1>
          <p className="text-gray-500">Welcome back! Please login to your account.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="text" 
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
