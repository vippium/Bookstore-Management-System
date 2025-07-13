import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserCircle,
  ShieldCheck,
  User2,
  ListOrdered,
  BarChartBig,
  Book,
  CirclePlus
} from 'lucide-react'

import AuthContext from '../../context/AuthContext'
import BookManager from '../../components/BookManager'
import AdminOrderPanel from '../../components/AdminOrderPanel'
import useAnalytics from '../../services/useAnalytics'
import OrdersChart from '../../components/OrdersChart'
import SalesChart from '../../components/SalesChart'
import TopGenresChart from '../../components/TopGenresChart'

export default function AdminDashboard () {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { data: stats, loading } = useAnalytics()

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in'>
      {/* 👤 Admin Info Card */}
      <div className='relative bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:shadow-xl hover:ring-1 hover:ring-blue-500 transition-all hover:scale-[1.02] duration-300'>
        <span
          className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1
              ${
                user?.role === 'admin'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
        >
          {user?.role === 'admin' ? (
            <>
              <ShieldCheck className='w-3.5 h-3.5' />
              Administrator
            </>
          ) : (
            <>
              <User2 className='w-3.5 h-3.5' />
              Customer
            </>
          )}
        </span>

        <div className='flex items-center gap-3 mb-4'>
          <UserCircle className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>Admin Info</h2>
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
            onClick={() => alert('⚠️ Add delete logic')}
            className='px-4 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium'
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* 📚 Book Manager */}
      <div className='bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <Book className='w-6 h-6 text-blue-600' />
            <h2 className='text-xl font-semibold text-blue-700'>
              Manage Books
            </h2>
          </div>

          <button
            onClick={() => navigate('/admin/books/new')}
            className='bg-blue-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-blue-700 transition font-medium flex items-center gap-2'
          >
            <CirclePlus className='w-4 h-4' />
            Add Book
          </button>
        </div>

        <div className='max-h-[450px] overflow-y-auto pr-1 custom-scrollbar'>
          <BookManager />
        </div>
      </div>

      {/* 📦 Manage Orders */}
      <div className='bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500'>
        <div className='flex items-center gap-3 mb-4'>
          <ListOrdered className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>Manage Orders</h2>
        </div>
        <AdminOrderPanel />
      </div>

      {/* 📊 Site Analytics */}
      <div className='bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500 transition-all'>
        <div className='flex items-center gap-3 mb-4'>
          <BarChartBig className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-blue-700'>
            Site Analytics
          </h2>
        </div>

        {loading ? (
          <p className='text-sm text-gray-500'>Loading analytics...</p>
        ) : (
          <div className='space-y-6'>
            {/* Row 1: Revenue + Orders */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-600 mb-1'>
                  Total Revenue (Last 7 Days)
                </h3>
                <SalesChart stats={stats.orders} />
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-600 mb-1'>
                  Orders (Last 7 Days)
                </h3>
                <OrdersChart stats={stats.orders} />
              </div>
            </div>

            {/* Row 2: Top Genres */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-600 mb-1'>
                  Top-Selling Genres
                </h3>
                <TopGenresChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
