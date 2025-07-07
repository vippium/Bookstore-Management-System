import { useContext } from "react";
import CartContext from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">🛒 My Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border rounded-3xl shadow-sm bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={(e) => (e.target.src = "/placeholder.jpeg")}
                  className="w-20 h-28 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">by {item.author}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="font-bold text-blue-600">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6 font-semibold text-xl text-blue-700">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
