import { createContext, useState, useEffect } from 'react'
import api from '../services/axios'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
          logout()
          setLoadingAuth(false)
          return
        }
      } catch (e) {
        logout()
        setLoadingAuth(false)
        return
      }

      api
        .get('/auth/me')
        .then(res => {
          setUser(res.data.user)
          setIsLoggedIn(true)
        })
        .catch(() => {
          logout()
        })
        .finally(() => setLoadingAuth(false))
    } else {
      setLoadingAuth(false)
    }
  }, [])

  const login = async (email, password, remember = false) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, userId, message } = res.data

      if (message?.includes('Email not verified')) {
        toast.error(message)
        return { success: false, userId, message }
      }

      if (remember) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }

      const userRes = await api.get('/auth/me')
      setUser(userRes.data.user)
      setIsLoggedIn(true)
      toast.success('Logged in successfully!')
      return { success: true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { userId } = res.data
      return { success: true, userId }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    localStorage.removeItem('cart_synced')
    setUser(null)
    setIsLoggedIn(false)
    toast.success('Logged out successfully!')
  }

  const loginWithToken = async token => {
    try {
      if (token) {
        localStorage.setItem('token', token)
      }

      const userRes = await api.get('/auth/me')
      setUser(userRes.data.user)
      setIsLoggedIn(true)
      toast.success('Email verified and logged in successfully!')
      return { success: true }
    } catch (err) {
      toast.error('Failed to log in after verification')
      return { success: false }
    }
  }

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete')
      toast.success('Account deleted successfully!')
      logout()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        loadingAuth,
        register,
        loginWithToken,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
