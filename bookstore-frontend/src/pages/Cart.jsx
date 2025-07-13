import { useContext, useRef, useState, useEffect } from 'react'
import CartContext from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'

export default function Cart () {
  const { cartItems, updateQuantity, removeFromCart, loadingCart } =
    useContext(CartContext)

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const holdRef = useRef(null)
  const [shakeId, setShakeId] = useState(null)
  const navigate = useNavigate()

  const startHold = (callback, condition, id) => {
    if (condition) {
      setShakeId(id)
      setTimeout(() => setShakeId(null), 500)
      return
    }
    callback()
    holdRef.current = setInterval(callback, 150)
  }

  const stopHold = () => clearInterval(holdRef.current)

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <div className='max-w-5xl mx-auto p-6 animate-fade-in'>
      <Breadcrumb
        current='Your Cart'
        icon={<ShoppingCart className='w-6 h-6 mr-1' />}
      />

      {cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center text-gray-500 py-20 animate-zoom-in'>
          <ShoppingCart className='w-16 h-16 mb-4 text-blue-200' />
          <h2 className='text-2xl font-semibold mb-2 text-blue-700'>
            Your cart is empty
          </h2>
          <p className='mb-4'>
            Looks like you haven’t added anything to your cart yet.
          </p>
          <Link
            to='/'
            className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition'
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {cartItems.map(item => {
            const isMin = item.quantity <= 1
            const isMax = item.stock ? item.quantity >= item.stock : false
            const minKey = `${item._id}-min`
            const maxKey = `${item._id}-max`

            return (
              <div
                key={item._id}
                className='flex items-center gap-4 border rounded-xl p-4 bg-white shadow relative'
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={e => (e.target.src = '/placeholder.jpeg')}
                  className='w-24 h-32 object-cover rounded'
                />

                <div className='flex-1'>
                  <h3 className='text-lg font-semibold'>{item.title}</h3>
                  <p className='text-sm text-gray-600'>{item.author}</p>
                  <p className='mt-1 text-blue-600 font-semibold text-sm'>
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className='flex items-center mt-3 space-x-2'>
                    {/* Decrease */}
                    <button
                      onMouseDown={() =>
                        startHold(
                          () => updateQuantity(item._id, item.quantity - 1),
                          isMin,
                          minKey
                        )
                      }
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() =>
                        startHold(
                          () => updateQuantity(item._id, item.quantity - 1),
                          isMin,
                          minKey
                        )
                      }
                      onTouchEnd={stopHold}
                      disabled={isMin}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition ${
                        isMin
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      } ${shakeId === minKey ? 'animate-shake' : ''}`}
                    >
                      −
                    </button>

                    <span className='text-sm font-medium'>{item.quantity}</span>

                    {/* Increase */}
                    <button
                      onMouseDown={() =>
                        startHold(
                          () => updateQuantity(item._id, item.quantity + 1),
                          isMax,
                          maxKey
                        )
                      }
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={() =>
                        startHold(
                          () => updateQuantity(item._id, item.quantity + 1),
                          isMax,
                          maxKey
                        )
                      }
                      onTouchEnd={stopHold}
                      disabled={isMax}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition ${
                        isMax
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      } ${shakeId === maxKey ? 'animate-shake' : ''}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove badge */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-1 rounded-full hover:bg-red-100 transition'
                >
                  <Trash2 className='w-4 h-4' />
                  Remove
                </button>
              </div>
            )
          })}

          <div className='text-right text-2xl font-bold text-blue-800 mt-6'>
            Total: ₹{total.toFixed(2)}
          </div>

          <div className='text-right'>
            <button
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
              className='mt-4 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-semibold transition disabled:opacity-40'
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
