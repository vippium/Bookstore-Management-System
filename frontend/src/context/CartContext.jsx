import { createContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add book to cart
  const addToCart = (book) => {
    const exists = cartItems.find(item => item.book._id === book._id);
    if (exists) {
      setCartItems(prev =>
        prev.map(item =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { book, quantity: 1 }]);
    }
  };

  // Remove book
  const removeFromCart = (bookId) => {
    setCartItems(prev => prev.filter(item => item.book._id !== bookId));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Update quantity
  const updateQuantity = (bookId, quantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.book._id === bookId
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
