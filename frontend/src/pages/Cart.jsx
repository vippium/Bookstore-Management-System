import { useContext } from 'react';
import CartContext from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useContext(CartContext);

  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.book._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <h3 className="font-semibold">{item.book.title}</h3>
                <p className="text-sm text-gray-500">
                  ₹{item.book.price} ×
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.book._id, parseInt(e.target.value))
                    }
                    className="w-16 ml-2 border rounded px-1"
                  />
                </p>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => removeFromCart(item.book._id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4 text-right font-semibold">
            Total: ₹{total}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
