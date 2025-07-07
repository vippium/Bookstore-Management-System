import { useContext, useState } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import api from '../services/axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      return navigate('/login');
    }

    try {
      const orderPayload = {
        books: cartItems.map(item => ({
          book: item.book._id,
          quantity: item.quantity
        })),
        totalPrice
      };

      const token = localStorage.getItem('token');
      await api.post('/orders', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.book._id} className="border-b py-2">
              <p>{item.book.title} × {item.quantity}</p>
            </div>
          ))}

          <div className="mt-4 font-semibold">Total: ₹{totalPrice}</div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
