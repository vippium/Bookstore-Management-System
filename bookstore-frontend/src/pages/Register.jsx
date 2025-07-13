import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Mail,
  Lock,
  Loader,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const TEMPORARY_EMAIL_DOMAINS = [
  'mailinator.com',
  'temp-mail.org',
  'guerrillamail.com',
  'mail.tm',
  'yopmail.com',
  '10minutemail.com',
  'tempmail.org',
  'tempmail.com',
  'disposablemail.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'trashmail.com',
  'moakt.com',
  'maildrop.cc',
  'spamgourmet.com',
  'getnada.com',
  'mail.ch',
  'dropmail.me',
  'temp-mail.ru',
  'tmail.ws',
  'emailondeck.com',
  'anonbox.net',
  'meltmail.com',
  'mytrashmail.com',
  'mailnesia.com',
  'tempinbox.com',
  'tempmailo.com',
  '0-mail.com',
  'fleckens.hu',
  'hulapla.de',
  'jourrapide.com',
  'kasmail.com',
  'linkto.ws',
  'mail.by',
  'mail.wtf',
  'mail.zp.ua',
  'mailcatch.com',
  'mailmoat.com',
  'mailna.biz',
  'mailna.me',
  'mailsac.com',
  'mailscrap.com',
  'mailtemp.net',
  'mailto.ws',
  'mistergf.net',
  'mr.us.to',
  'mx.vc',
  'my.rt.ru',
  'my.vc',
  'nospammail.net',
  'nowmymail.com',
  'oopi.me',
  'pancakemail.com',
  'privacy.net',
  'proxymail.eu',
  'quad.me',
  'rcpt.at',
  'recode.me',
  'rhyta.com',
  's0ny.net',
  'sendspamhere.com',
  'sharkz.de',
  'smellfear.com',
  'snakemail.com',
  'sogetthis.com',
  'soodonims.com',
  'spam.la',
  'spambox.us',
  'spamcero.com',
  'spamherelots.com',
  'spamhole.com',
  'spaml.com',
  'spamobox.com',
  'spamspot.com',
  'temp-mail.com',
  'temp-mail.net',
  'temp-mail.org',
  'temp.bot',
  'temporaryemail.net',
  'temporaryinbox.com',
  'tempmail.io',
  'tempmail.us',
  'test.com',
  'thisisnotmyrealemail.com',
  'thrma.com',
  'tmpbox.net',
  'tracemail.info',
  'trash-mail.com',
  'trashmail.me',
  'trashymail.com',
  'tyldum.com',
  'unmail.ru',
  'user.lt',
  'venomail.com',
  'wegwerfmail.de',
  'wetrain.cc',
  'whyspam.me',
  'xag0.com',
  'xents.com',
  'xmaily.com',
  'yapped.net',
  'yep.it',
  'zippymail.info',
  'zoemail.org'
]

export default function Register () {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
    if (name === 'password') updatePasswordStrength(value)
  }

  const updatePasswordStrength = pwd => {
    if (!pwd) return setPasswordStrength('')
    if (pwd.length < 6) return setPasswordStrength('weak')
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return setPasswordStrength('strong')
    return setPasswordStrength('medium')
  }

  const isTemporaryEmail = email => {
    const domain = email.split('@')[1]
    return TEMPORARY_EMAIL_DOMAINS.includes(domain)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format'
    } else if (isTemporaryEmail(form.email)) {
      errs.email = 'Temporary email addresses are not allowed'
    }

    if (!form.password) errs.password = 'Password is required'
    if (passwordStrength === 'weak') errs.password = 'Password is too weak'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const success = await register(form.name, form.email, form.password)
      if (success) {
        toast.success('Registration successful! Please login.', {
          icon: <CheckCircle size={20} className='text-green-500' />
        })
        navigate('/login')
      } else {
        toast.error('Registration failed. Please try again.', {
          icon: <XCircle size={20} className='text-red-500' />
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(
        error.response?.data?.message ||
          'An unexpected error occurred during registration.',
        { icon: <XCircle size={20} className='text-red-500' /> }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8'>
      <div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-blue-100 animate-fade-in-up'>
        {/* Register Header */}
        <div className='flex flex-col items-center mb-8'>
          <UserPlus className='w-16 h-16 text-blue-600 mb-4' />
          <h2 className='text-3xl font-bold text-blue-700 text-center'>
            Join Our Community
          </h2>
          <p className='text-gray-500 text-sm mt-2'>
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Name Input */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name
            </label>
            <div className='relative'>
              <input
                type='text'
                id='name'
                name='name'
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                  ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                placeholder='John Doe'
              />
              <User className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
            </div>
            {errors.name && (
              <p className='text-xs text-red-500 mt-1'>{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <div className='relative'>
              <input
                type='email'
                id='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                  ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                placeholder='your.email@example.com'
              />
              <Mail className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
            </div>
            {errors.email && (
              <p className='text-xs text-red-500 mt-1'>{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                  ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                placeholder='Create a strong password'
              />
              <Lock className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <span
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors'
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {passwordStrength && (
              <div
                className={`text-xs font-medium mt-1
                  ${
                    passwordStrength === 'weak'
                      ? 'text-red-500'
                      : passwordStrength === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
              >
                Strength: <span className='capitalize'>{passwordStrength}</span>
              </div>
            )}
            {errors.password && (
              <p className='text-xs text-red-500 mt-1'>{errors.password}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin' /> Registering...
              </>
            ) : (
              'Register'
            )}
          </button>

          {/* Login Link */}
          <p className='text-sm text-gray-600 text-center mt-6'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 hover:underline font-medium'
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
