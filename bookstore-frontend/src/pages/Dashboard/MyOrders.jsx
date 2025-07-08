import { useEffect, useState } from "react";
import api from "../../services/axios";
import { CalendarDays, ReceiptText } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        <ReceiptText className="w-5 h-5" />
        My Orders
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-blue-600 font-medium">
                  Total: ₹{order.total}
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <strong>Items:</strong>{" "}
                {order.items.map((item) => `${item.title} × ${item.quantity}`).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
