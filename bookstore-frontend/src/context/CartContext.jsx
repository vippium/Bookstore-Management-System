import { createContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
  const exists = cart.find((item) => item._id === book._id);
  if (exists) {
    // 🔁 Increase quantity if already in cart
    setCart((prev) =>
      prev.map((item) =>
        item._id === book._id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + (book.quantity || 1),
                item.stock || 99
              ),
            }
          : item
      )
    );
  } else {
    // 🆕 Add new book with provided quantity
    setCart([...cart, { ...book, quantity: book.quantity || 1 }]);
  }
};



  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ✅ FIXED: updateQuantity now inside and uses setCart
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const limitedQty = Math.max(1, Math.min(quantity, item.stock || 99)); // max at stock
          return { ...item, quantity: limitedQty };
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};


export default CartContext;
