import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/axios'
import { toast } from 'react-hot-toast'
import AuthContext from './AuthContext'
import { HeartCrack, Heart, XCircle, CheckCircle } from 'lucide-react'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const { isLoggedIn, loadingAuth } = useContext(AuthContext)

  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      setWishlist([])
      setLoadingWishlist(false)
      return
    }
    setLoadingWishlist(true)
    try {
      const res = await api.get('/wishlist')
      setWishlist(res.data)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      if (error.response && error.response.status === 401) {
      } else {
        toast.error('Failed to load wishlist.', {
          icon: <XCircle size={20} className='text-red-500' />
        })
      }
      setWishlist([])
    } finally {
      setLoadingWishlist(false)
    }
  }

  useEffect(() => {
    if (!loadingAuth) {
      fetchWishlist()
    }
  }, [isLoggedIn, loadingAuth])

  const addToWishlist = async bookId => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to wishlist.', {
        icon: <XCircle size={20} className='text-red-500' />
      })
      return
    }
    try {
      await api.post('/wishlist', { bookId })
      toast.success('Added to wishlist!', {
        icon: <Heart size={20} className='text-red-500' />
      })
      fetchWishlist()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to add to wishlist (possibly already in wishlist)',
        { icon: <XCircle size={20} className='text-red-500' /> }
      )
    }
  }

  const removeFromWishlist = async bookId => {
    if (!isLoggedIn) {
      toast.error('Please login to manage wishlist.', {
        icon: <XCircle size={20} className='text-red-500' />
      })
      return
    }
    try {
      await api.delete(`/wishlist/${bookId}`)
      toast.success('Removed from wishlist!', {
        icon: <HeartCrack size={20} className='text-red-500' />
      })
      fetchWishlist()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to remove from wishlist',
        { icon: <XCircle size={20} className='text-red-500' /> }
      )
    }
  }

  const contextValue = {
    wishlist,
    loadingWishlist,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist
  }

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistContext
