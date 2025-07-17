import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, ShieldCheck, User2, Trash2, ListOrdered, BarChartBig } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthContext from '../../context/AuthContext'
import MyOrders from './MyOrders'
import UserOrdersChart from '../../components/UserOrdersChart'

export default function Dashboard() {
  const { user, deleteAccount } = useContext(AuthContext)
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount()
      toast.success('Your account has been deleted.')
    } catch (err) {
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setConfirmDelete(false)
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in'>
      {/* User Info */}
      <div className='relative bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:shadow-xl hover:ring-1 hover:ring-blue-500 transition-all hover:scale-[1.02] duration-300'>
        <span className='absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1 bg-blue-100 text-blue-700'>
          <User2 className='w-3.5 h-3.5' />
          Customer
        </span>

        <div className='flex items-center gap-3 mb-4'>
          <UserCircle className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>User Info</h2>
        </div>

        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <div className='mt-4 flex gap-4'>
          <button
            onClick={() => navigate('/profile')}
            className='px-4 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition font-medium'
          >
            Edit Profile
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className='px-4 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium'
          >
            Delete Account
          </button>
        </div>

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className='absolute top-20 right-6 z-50'>
            <div className='bg-white border border-red-200 rounded-xl shadow-lg p-5 w-80 animate-fade-in-up'>
              <h3 className='text-base font-semibold text-gray-800 mb-2'>
                Confirm Account Deletion
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className='flex justify-end gap-3'>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className='px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium'
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className='px-3 py-1.5 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white font-medium'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* My Orders */}
      <div className='bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500'>
        <div className='flex items-center gap-3 mb-4'>
          <ListOrdered className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>My Orders</h2>
        </div>
        <MyOrders />
      </div>

      {/* Order Summary */}
      <div className='bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500'>
        <div className='flex items-center gap-3 mb-4'>
          <BarChartBig className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>Order Summary</h2>
        </div>
        <UserOrdersChart />
      </div>
    </div>
  )
}
