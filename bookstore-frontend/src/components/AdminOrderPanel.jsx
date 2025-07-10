import { useEffect, useState } from "react";
import api from "../services/axios";
import {
  Loader,
  Clock,
  Package,
  Truck,
  Check,
  XCircle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "gray",
  },
  {
    value: "processing",
    label: "Processing",
    icon: <Package className="w-3.5 h-3.5" />,
    color: "blue",
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: <Truck className="w-3.5 h-3.5" />,
    color: "indigo",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: <Check className="w-3.5 h-3.5" />,
    color: "green",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: "red",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return { bg: "bg-gray-100", text: "text-gray-700" };
    case "processing":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "shipped":
      return { bg: "bg-indigo-100", text: "text-indigo-700" };
    case "delivered":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
};

const getBadgeClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-indigo-100 text-indigo-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-200 text-gray-500";
  }
};

export default function AdminOrderPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-blue-600">
        <Loader className="w-5 h-5 animate-spin mr-2" />
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...statusOptions.map((opt) => opt.value)].map((status) => {
          const opt = statusOptions.find((s) => s.value === status);
          const isActive = filter === status;
          const badgeClass = opt
            ? getBadgeClass(opt.value)
            : "bg-gray-100 text-gray-700";

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition 
                ${
                  isActive
                    ? `${badgeClass} ring-2 ring-offset-1 ring-${opt?.color}-300`
                    : `${badgeClass} hover:opacity-80`
                }`}
            >
              {opt?.icon}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Order List */}
      <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar space-y-5">
        {filteredOrders.map((order) => {
          const currentStatus = statusOptions.find(
            (s) => s.value === order.status
          );
          const badge = getStatusStyle(order.status);

          return (
            <div
              key={order._id}
              className="border border-blue-100 rounded-2xl p-4 shadow-sm bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-blue-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {/* User Info and Dropdown */}
              <div className="space-y-1">
                <div className="text-xs text-gray-600 flex justify-between items-center">
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span className="font-medium">
                      {order.userId?.name || "Unknown"}
                    </span>{" "}
                    – {order.userId?.email}
                  </div>

                  <span className="text-sm text-blue-800 font-semibold">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>

                <div
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium gap-2 w-fit ${badge.bg} ${badge.text}`}
                >
                  {currentStatus?.icon}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-transparent text-sm font-medium focus:outline-none"
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
