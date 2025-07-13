import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/axios'
import CartContext from '../context/CartContext'
import AuthContext from '../context/AuthContext'
import WishlistContext from '../context/WishlistContext'
import Breadcrumb from '../components/Breadcrumb'
import StarRating from '../components/StarRating'
import {
  BookOpen,
  Book,
  BadgeCheck,
  Minus,
  Plus,
  Heart,
  XCircle
} from 'lucide-react'
import Tippy from '@tippyjs/react'
import toast from 'react-hot-toast'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'

export default function BookDetails () {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { wishlist, addToWishlist, removeFromWishlist, fetchWishlist } =
    useContext(WishlistContext)
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(console.error)
    fetchReviews()
  }, [id])

  useEffect(() => {
    if (wishlist && book) {
      setIsWishlisted(
        wishlist.some(item => item.book && item.book._id === book._id)
      )
    }
  }, [wishlist, book])

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/ratings/book/${id}`)
      const allRatings = res.data?.ratings || []
      const filtered = allRatings.filter(r => r.review?.trim())
      setReviews(filtered)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      setReviews([])
    }
  }

  const handleQuantity = type => {
    setQuantity(prev => {
      if (type === 'inc' && prev < book.stock) return prev + 1
      if (type === 'dec' && prev > 1) return prev - 1
      return prev
    })
  }

  const handleAddToCart = () => {
    addToCart(book, quantity)
    setAnimateCart(true)
    setTimeout(() => setAnimateCart(false), 300)
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to manage your wishlist.', {
        icon: <XCircle size={20} className='text-red-500' />
      })
      return
    }
    if (isWishlisted) {
      await removeFromWishlist(book._id)
    } else {
      await addToWishlist(book._id)
    }
  }

  if (!book) {
    return null
  }

  const shortDesc = book.description?.slice(0, 150) || ''

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb current='Book Info' icon={<Book className='w-6 h-6' />} />

      {/* Book Info */}
      <div className='max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8 animate-zoom-in'>
        {/* Book Cover */}
        <div className='md:w-1/2'>
          <img
            src={book.imageUrl || '/placeholder.jpeg'}
            alt={book.title}
            onError={e => (e.target.src = '/placeholder.jpeg')}
            className='w-full h-auto max-h-[500px] object-contain rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105'
          />
        </div>

        {/* Book Details */}
        <div className='md:w-1/2 flex flex-col justify-between'>
          <div>
            <div className='flex items-center gap-2 text-blue-700 font-semibold mb-2'>
              <BookOpen className='w-5 h-5' />
              <span className='text-2xl font-bold'>{book.title}</span>
            </div>

            <div className='text-yellow-600 text-sm mt-1 mb-2'>
              <StarRating bookId={book._id} readOnly={true} />
            </div>

            <p className='text-gray-700 text-sm mt-3 mb-1'>
              <span className='font-medium'>Author:</span> {book.author}
            </p>

            <p className='text-sm text-gray-700 mb-2'>
              <span className='font-medium'>Genre:</span>{' '}
              <span className='inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold'>
                {book.genre}
              </span>
            </p>

            <p className='text-2xl font-bold text-blue-800 mt-2 mb-1'>
              ₹{book.price}
            </p>

            <p className='text-sm text-gray-500'>
              {book.stock > 0 ? (
                <span className='text-green-600 flex items-center gap-1'>
                  <BadgeCheck className='w-4 h-4' />
                  In stock ({book.stock})
                </span>
              ) : (
                <span className='text-red-500'>Out of Stock</span>
              )}
            </p>

            {/* Book Description */}
            {book.description && (
              <div className='mt-4 text-sm text-gray-600 leading-relaxed'>
                {showFullDesc ? book.description : shortDesc + '...'}
                {book.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className='text-blue-600 text-xs ml-2 underline'
                  >
                    {showFullDesc ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Item Quantity Controls */}
          <div className='flex items-center gap-2 mt-4'>
            <button
              onClick={() => handleQuantity('dec')}
              disabled={quantity <= 1}
              className='w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 transition-colors shadow-sm'
            >
              <Minus size={18} />
            </button>
            <span className='text-md font-semibold w-8 text-center'>
              {quantity}
            </span>
            <button
              onClick={() => handleQuantity('inc')}
              disabled={quantity >= book.stock}
              className='w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 transition-colors shadow-sm'
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Action Buttons & Wishlist Button */}
          <div className='flex gap-3 flex-wrap mt-4'>
            <Tippy
              content={
                !user
                  ? 'Login to add to cart'
                  : book.stock < 1
                  ? 'Out of stock'
                  : ''
              }
              disabled={user && book.stock > 0}
              animation='scale'
              theme='light-border'
              placement='top'
            >
              <button
                onClick={() => user && handleAddToCart()}
                disabled={book.stock < 1 || !user}
                className={`px-6 py-2.5 rounded-full font-semibold transition duration-300 shadow-md
                  ${
                    !user || book.stock < 1
                      ? 'bg-gray-300 text-white cursor-not-allowed'
                      : `bg-blue-600 text-white hover:bg-blue-700 ${
                          animateCart ? 'scale-105' : ''
                        }`
                  }`}
              >
                Add to Cart
              </button>
            </Tippy>

            <Tippy
              content={
                !user
                  ? 'Login to buy now'
                  : book.stock < 1
                  ? 'Out of stock'
                  : ''
              }
              disabled={user && book.stock > 0}
              animation='scale'
              theme='light-border'
              placement='top'
            >
              <button
                onClick={() =>
                  user && navigate('/checkout', { state: { book, quantity } })
                }
                disabled={book.stock < 1 || !user}
                className={`px-6 py-2.5 rounded-full font-semibold transition shadow-md
                  ${
                    !user || book.stock < 1
                      ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
              >
                Buy Now
              </button>
            </Tippy>

            {/* Wishlist Button */}
            <Tippy
              content={
                !user
                  ? 'Login to manage wishlist'
                  : isWishlisted
                  ? 'Remove from Wishlist'
                  : 'Add to Wishlist'
              }
              disabled={!user}
              animation='scale'
              theme='light-border'
              placement='top'
            >
              <button
                onClick={handleToggleWishlist}
                disabled={!user}
                className={`px-4 py-2 rounded-full border flex items-center gap-1 transition-colors duration-200 shadow-sm
                  ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-400 text-gray-600 hover:bg-gray-100'
                  }
                  ${!user ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Heart
                  size={18}
                  className={`${
                    isWishlisted ? 'fill-red-500' : 'fill-transparent'
                  }`}
                />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='max-w-5xl mx-auto mt-8 p-4 bg-white rounded-xl shadow-sm border'>
        <h3 className='text-lg font-semibold text-blue-700 mb-3'>
          User Reviews
        </h3>

        {/* User's Star Rating and Review Input (Conditionally rendered) */}
        {user && <StarRating bookId={book._id} onRated={fetchReviews} />}

        {reviews.length === 0 ? (
          <p className='text-sm text-gray-500 mt-4'>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <ul className='space-y-4 mt-4'>
            {reviews.map(r => (
              <li key={r._id} className='border-b pb-3'>
                <p className='text-sm text-gray-700'>{r.review}</p>
                <div className='text-xs text-gray-400 mt-1'>
                  – {r.userName || 'Anonymous'} ({r.stars}★)
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
