import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/axios';
import toast from 'react-hot-toast';
import { Loader, ShieldCheck } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email;

  const { loginWithToken } = useContext(AuthContext);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error('Missing user ID. Redirecting to login...');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleVerify = async e => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Please enter your OTP');

    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { userId, otp });
      const { token } = res.data;

      const result = await loginWithToken(token);

      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8'>
      <div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-blue-100 animate-fade-in-up'>
        <div className='flex flex-col items-center mb-6'>
          <ShieldCheck className='w-12 h-12 text-blue-600 mb-2' />
          <h2 className='text-xl font-bold text-blue-700'>Verify OTP</h2>
          <p className='text-sm text-gray-500 mt-1 text-center'>
            Enter the 6-digit code sent to your email
            {email && <span className='font-semibold'> ({email})</span>}
          </p>
        </div>

        <form onSubmit={handleVerify} className='space-y-6'>
          <div>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              className='w-full px-4 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base text-center'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin' /> Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
