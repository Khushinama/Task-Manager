import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const { verifyEmail } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyEmail(email, otp);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[80vh]"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Verify Email</h1>
          <p className="text-gray-500">We've sent a 6-digit OTP to <strong>{email}</strong></p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input 
              type="text" 
              required 
              maxLength="6"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-center tracking-[0.5em] font-mono text-2xl"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Verify & Continue
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
