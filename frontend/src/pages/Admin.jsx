import { useEffect, useState } from 'react';
import api from '../services/axios';

export default function Admin() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/orders/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await api.put(`/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🛠 Admin Dashboard</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <p className="font-semibold">Customer: {order.user?.name}</p>
            <p className="text-sm text-gray-500">
              Status: {order.status} | Payment: {order.paymentStatus}
            </p>
            <ul className="mt-2 list-disc ml-6">
              {order.books.map(item => (
                <li key={item.book._id}>
                  {item.book.title} × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right">
              <span className="mr-4 font-bold">Total: ₹{order.totalPrice}</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border p-1 rounded"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
