import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function ProtectedRoute () {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center text-blue-700 font-semibold'>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to='/dashboard' replace />
  }

  if (location.pathname.startsWith('/dashboard') && user.role === 'admin') {
    return <Navigate to='/admin' replace />
  }

  return <Outlet />
}
