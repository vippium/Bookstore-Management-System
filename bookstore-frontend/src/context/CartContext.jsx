import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/axios';
import { toast } from 'react-hot-toast';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const { isLoggedIn, user, loadingAuth } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    try {
      const response = await api.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to load cart:", error);
      if (error.response && error.response.status === 401) {
      } else {
        toast.error("Failed to load cart.");
      }
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!loadingAuth) {
      fetchCart();
    }
  }, [isLoggedIn, loadingAuth, fetchCart]);

  const saveCartToBackend = useCallback(async (currentItems) => {
    if (!isLoggedIn) {
      return;
    }
    try {
      await api.post('/cart', { items: currentItems });
    } catch (error) {
      console.error("Failed to save cart to backend:", error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
        saveCartToBackend(cartItems);
    }
  }, [cartItems, isLoggedIn, saveCartToBackend]);


  const addToCart = async (book, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart.");
      return;
    }

    const existingItemIndex = cartItems.findIndex(item => item._id === book._id);

    let updatedCart;
    if (existingItemIndex > -1) {
      updatedCart = cartItems.map(item =>
        item._id === book._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cartItems, {
        _id: book._id,
        title: book.title,
        price: book.price,
        imageUrl: book.imageUrl,
        quantity: quantity,
      }];
    }
    setCartItems(updatedCart);
    toast.success(`${book.title} added to cart!`);
  };

  const removeFromCart = async (bookId) => {
    if (!isLoggedIn) {
      toast.error("Please login to manage cart.");
      return;
    }
    const updatedCart = cartItems.filter(item => item._id !== bookId);
    setCartItems(updatedCart);
    toast.success("Item removed from cart!");
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (!isLoggedIn) {
      toast.error("Please login to manage cart.");
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item._id === bookId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
  };

  const clearCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to clear cart.");
      return;
    }
    try {
      await api.delete('/cart');
      setCartItems([]);
      toast.success("Cart cleared!");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadingCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;