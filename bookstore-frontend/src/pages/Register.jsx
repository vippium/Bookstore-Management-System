import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Loader, Eye, EyeOff, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/axios';

const TEMPORARY_EMAIL_DOMAINS = [/* ...existing list truncated for brevity... */];

export default function Register() {
  const { register, loginWithToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState('register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'password') updatePasswordStrength(value);
  };

  const updatePasswordStrength = pwd => {
    if (!pwd) return setPasswordStrength('');
    if (pwd.length < 6) return setPasswordStrength('weak');
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return setPasswordStrength('strong');
    return setPasswordStrength('medium');
  };

  const isTemporaryEmail = email => {
    const domain = email.split('@')[1];
    return TEMPORARY_EMAIL_DOMAINS.includes(domain);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format';
    } else if (isTemporaryEmail(form.email)) {
      errs.email = 'Temporary email addresses are not allowed';
    }
    if (!form.password) errs.password = 'Password is required';
    if (passwordStrength === 'weak') errs.password = 'Password is too weak';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      if (res?.userId) {
        setUserId(res.userId);
        setStep('otp');
        toast.success('OTP sent to your email. Please verify.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async e => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Please enter your OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { userId, otp });
      const { token } = res.data;
      const result = await loginWithToken(token);
      if (result.success) navigate('/');
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
          <h2 className='text-xl font-bold text-blue-700'>
            {step === 'register' ? 'Create Your Account' : 'Verify Your Email'}
          </h2>
          <p className='text-sm text-gray-500 mt-1 text-center'>
            {step === 'register'
              ? 'Enter your details to sign up'
              : `Enter the OTP sent to ${form.email}`}
          </p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className='space-y-6'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
              <div className='relative'>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm text-base ${
                    errors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder='John Doe'
                />
                <User className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              </div>
              {errors.name && <p className='text-xs text-red-500 mt-1'>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
              <div className='relative'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm text-base ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder='your@email.com'
                />
                <Mail className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              </div>
              {errors.email && <p className='text-xs text-red-500 mt-1'>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm text-base ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder='Create a strong password'
                />
                <Lock className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                <span
                  className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {passwordStrength && (
                <p className={`text-xs mt-1 ${
                  passwordStrength === 'weak' ? 'text-red-500'
                  : passwordStrength === 'medium' ? 'text-yellow-600'
                  : 'text-green-600'
                }`}>
                  Strength: {passwordStrength}
                </p>
              )}
              {errors.password && <p className='text-xs text-red-500 mt-1'>{errors.password}</p>}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2'
            >
              {loading ? <><Loader className='w-5 h-5 animate-spin' /> Sending Code...</> : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className='space-y-6'>
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
              className='w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold shadow-md flex items-center justify-center gap-2'
            >
              {loading ? <><Loader className='w-5 h-5 animate-spin' /> Verifying...</> : 'Verify & Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
