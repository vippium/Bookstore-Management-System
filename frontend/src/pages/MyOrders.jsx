import { useEffect, useState } from 'react';
import api from '../services/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow">
            <p className="font-semibold">Status: {order.status}</p>
            <p className="text-sm text-gray-500">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul className="mt-2 list-disc ml-6">
              {order.books.map((item) => (
                <li key={item.book._id}>
                  {item.book.title} × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold text-right">
              Total: ₹{order.totalPrice}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
