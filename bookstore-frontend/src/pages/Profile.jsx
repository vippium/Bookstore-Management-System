import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import api from '../services/axios'
import toast from 'react-hot-toast'
import {
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Trash2,
  CalendarDays,
  MailCheck,
  UserCircle,
  User,
  KeyRound,
  Flame,
  UserCog,
  Save,
  RotateCcw,
  UserX,
  Loader,
  XCircle
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Profile () {
  const { user, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('info')

  const [form, setForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' })
  const [passwordStrength, setPasswordStrength] = useState('')
  const [changing, setChanging] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email })
    }
  }, [user])

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePasswordInput = e => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })
    if (name === 'new') updatePasswordStrength(value)
  }

  const updatePasswordStrength = pwd => {
    if (!pwd) return setPasswordStrength('')
    if (pwd.length < 6) return setPasswordStrength('weak')
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return setPasswordStrength('strong')
    return setPasswordStrength('medium')
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.put('/auth/update', form)
      toast.success('Profile updated', {
        icon: <CheckCircle size={20} className='text-green-500' />
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed', {
        icon: <XCircle size={20} className='text-red-500' />
      })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (!passwordForm.current || !passwordForm.new) {
      return toast.error('Both fields are required', {
        icon: <XCircle size={20} className='text-red-500' />
      })
    }

    setChanging(true)
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new
      })
      toast.success('Password updated', {
        icon: <CheckCircle size={20} className='text-green-500' />
      })
      setPasswordForm({ current: '', new: '' })
      setPasswordStrength('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password', {
        icon: <XCircle size={20} className='text-red-500' />
      })
    } finally {
      setChanging(false)
    }
  }

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete')
      toast.success('Account deleted', {
        icon: <CheckCircle size={20} className='text-green-500' />
      })
      logout()
    } catch {
      toast.error('Failed to delete account', {
        icon: <XCircle size={20} className='text-red-500' />
      })
    }
  }

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8 animate-fade-in'>
      {/* Header */}
      <h2 className='text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6 border-b pb-3'>
        <UserCircle className='w-6 h-6 text-blue-600' />
        Manage Profile
      </h2>

      {/* Tab Buttons */}
      <div className='flex gap-3 text-sm border-b mb-6'>
        {[
          { key: 'info', label: 'Profile Info', icon: UserCog, color: 'blue' },
          {
            key: 'password',
            label: 'Change Password',
            icon: KeyRound,
            color: 'yellow'
          },
          { key: 'danger', label: 'Danger Zone', icon: Flame, color: 'red' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className={`w-4 h-4 text-${tab.color}-600`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode='wait'>
        {activeTab === 'info' && (
          <motion.div
            key='info'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className='space-y-5 p-4 border border-gray-200 rounded-lg bg-gray-50'
          >
            <div className='flex justify-end'>
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user?.isVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {user?.isVerified ? (
                  <>
                    <MailCheck className='w-4 h-4' />
                    Verified Email
                  </>
                ) : (
                  <>
                    <AlertTriangle className='w-4 h-4' />
                    Not Verified
                  </>
                )}
              </span>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Name
              </label>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleInput}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleInput}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm'
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition disabled:opacity-50 flex items-center gap-2'
            >
              {saving ? (
                <>
                  <Loader className='w-4 h-4 animate-spin' /> Saving...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' /> Save Changes
                </>
              )}
            </button>
          </motion.div>
        )}

        {activeTab === 'password' && (
          <motion.div
            key='password'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className='space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50'
          >
            <div className='flex items-center gap-2 text-yellow-600 font-semibold mb-2'>
              <Lock className='w-4 h-4' />
              Change Password
            </div>

            <input
              type='password'
              name='current'
              placeholder='Current Password'
              value={passwordForm.current}
              onChange={handlePasswordInput}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-sm'
            />
            <input
              type='password'
              name='new'
              placeholder='New Password'
              value={passwordForm.new}
              onChange={handlePasswordInput}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-sm'
            />

            {passwordStrength && (
              <div
                className={`text-xs font-medium ${
                  passwordStrength === 'weak'
                    ? 'text-red-500'
                    : passwordStrength === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                Strength: {passwordStrength}
              </div>
            )}

            <button
              onClick={changePassword}
              disabled={changing}
              className='bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-medium transition disabled:opacity-50 flex items-center gap-2'
            >
              {changing ? (
                <>
                  <Loader className='w-4 h-4 animate-spin' /> Changing...
                </>
              ) : (
                <>
                  <RotateCcw className='w-4 h-4' /> Change Password
                </>
              )}
            </button>
          </motion.div>
        )}

        {activeTab === 'danger' && (
          <motion.div
            key='danger'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className='space-y-4 p-4 border border-red-200 rounded-lg bg-red-50'
          >
            <div className='text-red-600 font-semibold flex items-center gap-2'>
              <Trash2 className='w-5 h-5' />
              Delete Account
            </div>
            <p className='text-sm text-gray-600'>
              This action is irreversible. All your data will be permanently
              deleted.
            </p>
            <button
              onClick={() => setConfirmDelete(true)}
              className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2'
            >
              <UserX className='w-4 h-4' /> Delete Account
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center space-y-4'>
            <Trash2 className='w-10 h-10 text-red-600 mx-auto' />
            <h3 className='text-lg font-semibold text-red-600'>
              Confirm Delete
            </h3>
            <p className='text-sm text-gray-600'>
              Are you sure you want to delete your account? This cannot be
              undone.
            </p>
            <div className='flex justify-center gap-4 mt-4'>
              <button
                onClick={() => setConfirmDelete(false)}
                className='px-4 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className='px-4 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Meta Info */}
      <div className='text-xs text-gray-500 flex flex-col sm:flex-row gap-4 mt-6 border-t pt-4'>
        <div className='flex items-center gap-1'>
          <CalendarDays className='w-4 h-4' />
          Joined:{' '}
          {new Date(user?.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>
        {user?.lastLogin && (
          <div className='flex items-center gap-1'>
            <ShieldCheck className='w-4 h-4' />
            Last Login:{' '}
            {new Date(user.lastLogin).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  )
}
