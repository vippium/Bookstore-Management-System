import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'
import api from '../services/axios'
import { toast } from 'react-hot-toast'
import AuthContext from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loadingCart, setLoadingCart] = useState(true)
  const { isLoggedIn, user, loadingAuth } = useContext(AuthContext)

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([])
      setLoadingCart(false)
      return
    }

    setLoadingCart(true)
    try {
      const response = await api.get('/cart')
      setCartItems(response.data)
    } catch (error) {
      console.error('Failed to load cart:', error)

      if (!(error.response && error.response.status === 401)) {
        toast.error('Failed to load cart.')
      }
      setCartItems([])
    } finally {
      setLoadingCart(false)
    }
  }, [isLoggedIn])

  const saveCartToBackend = useCallback(
    async currentItems => {
      if (!isLoggedIn) {
        return
      }
      try {
        await api.post('/cart', { items: currentItems })
      } catch (error) {
        console.error('Failed to save cart to backend:', error)
      }
    },
    [isLoggedIn]
  )

  useEffect(() => {
    if (!loadingAuth) {
      if (isLoggedIn) {
        fetchCart()

        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        if (guestCart.length > 0) {
          const mergedCart = [...cartItems]
          guestCart.forEach(guestItem => {
            const existingItemIndex = mergedCart.findIndex(
              item => item.bookId === guestItem.bookId
            )
            if (existingItemIndex > -1) {
              mergedCart[existingItemIndex].quantity += guestItem.quantity
            } else {
              mergedCart.push(guestItem)
            }
          })
          setCartItems(mergedCart)
          localStorage.removeItem('guestCart')
          toast.success('Guest cart merged!', { icon: '🛒' })
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        setCartItems(localCart)
        setLoadingCart(false)
      }
    }
  }, [isLoggedIn, loadingAuth, fetchCart])

  useEffect(() => {
    if (!loadingCart && isLoggedIn) {
      const handler = setTimeout(() => {
        saveCartToBackend(cartItems)
      }, 500)
      return () => {
        clearTimeout(handler)
      }
    } else if (!isLoggedIn && !loadingCart) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems))
    }
  }, [cartItems, loadingCart, isLoggedIn, saveCartToBackend])

  const addToCart = async (book, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item._id === book._id)
    let updatedCart

    if (existingItemIndex > -1) {
      updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      updatedCart = [
        ...cartItems,
        { ...book, bookId: book._id, quantity: quantity }
      ]
    }
    setCartItems(updatedCart)
    toast.success(`${book.title} added to cart!`)
  }

  const removeFromCart = async bookId => {
    if (!isLoggedIn) {
      toast.error('Please login to manage cart.')
      return
    }
    const updatedCart = cartItems.filter(item => item._id !== bookId)
    setCartItems(updatedCart)
    toast.success('Item removed from cart!')
  }

  const updateQuantity = async (bookId, newQuantity) => {
    if (!isLoggedIn) {
      toast.error('Please login to manage cart.')
      return
    }
    if (newQuantity <= 0) {
      removeFromCart(bookId)
      return
    }
    const updatedCart = cartItems.map(item =>
      item._id === bookId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
  }

  const clearCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to clear cart.')
      return
    }
    try {
      await api.delete('/cart')
      setCartItems([])
      toast.success('Cart cleared!')
    } catch (error) {
      console.error('Failed to clear cart:', error)
      toast.error('Failed to clear cart.')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadingCart,
        total: cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
