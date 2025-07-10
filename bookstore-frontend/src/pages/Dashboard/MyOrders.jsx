import { useEffect, useState, useContext, useRef } from "react";
import api from "../../services/axios";
import { Loader, Download, Repeat } from "lucide-react";
import CartContext from "../../context/CartContext";
import { useReactToPrint } from "react-to-print";
import InvoiceCard from "../../components/InvoiceCard";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // 🧠 Create a ref object to store dynamic refs
  const invoiceRefs = useRef({});

  const handlePrint = (orderId) => {
    const printHandler = useReactToPrint({
      content: () => invoiceRefs.current[orderId],
    });
    printHandler();
  };

  useEffect(() => {
    api.get("/orders/mine")
      .then((res) => setOrders(res.data))
      .catch(() => console.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "shipped": return "bg-indigo-100 text-indigo-700";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return "✅";
      case "processing": return "⏳";
      case "shipped": return "📦";
      case "cancelled": return "❌";
      default: return "🕓";
    }
  };

  const groupByDate = (orders) =>
    orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toDateString();
      acc[date] = acc[date] || [];
      acc[date].push(order);
      return acc;
    }, {});

  const handleReorder = (items) => {
    items.forEach((item) => {
      addToCart({ ...item, _id: item.bookId });
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-blue-600">
        <Loader className="w-5 h-5 animate-spin mr-2" />
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        <img src="/empty-box.png" alt="No Orders" className="w-32 mx-auto mb-3 opacity-70" />
        <p className="text-sm">No orders yet. Start shopping!</p>
      </div>
    );
  }

  const groupedOrders = groupByDate(orders);

  return (
    <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
      {Object.entries(groupedOrders).map(([date, dayOrders]) => (
        <div key={date} className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-600">{date}</h4>

          {dayOrders.map((order) => (
            <div
              key={order._id}
              className="border border-blue-100 rounded-2xl p-4 shadow-sm bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-blue-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
                <span className="text-sm text-blue-800 font-semibold">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>

              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.title} × {item.quantity}</li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex gap-3 text-xs mt-2">
                <button
                  onClick={() => handlePrint(order._id)}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Download className="w-4 h-4" /> Invoice
                </button>

                <button
                  onClick={() => handleReorder(order.items)}
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  <Repeat className="w-4 h-4" /> Re-order
                </button>
              </div>

              {/* Hidden invoice for print */}
              <div className="hidden">
                <InvoiceCard
                  ref={(el) => (invoiceRefs.current[order._id] = el)}
                  order={order}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
