import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import api from "../services/axios";
import { ShoppingBag, FileText, PackageCheck, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart, total: cartTotal, clearCart, removeFromCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const buyNowItem = location.state?.book;
  const quantity = location.state?.quantity || 1;

  const items = buyNowItem
    ? [{
        ...buyNowItem,
        quantity,
        bookId: buyNowItem._id,
      }]
    : cart;

  const total = buyNowItem
    ? buyNowItem.price * quantity
    : cartTotal;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const orderData = {
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      total,
      items: items.map(({ _id, title, price, quantity }) => ({
        bookId: _id,
        title,
        price,
        quantity,
      })),
    };

    try {
      await api.post("/orders", orderData);
      toast.success("✅ Order placed!");
      if (!buyNowItem) clearCart();
      navigate("/order-success", { state: { orderId: order._id } });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order";
      toast.error("❌ Order failed: " + msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-6">
        <ShoppingBag className="w-6 h-6" />
        <span>Checkout</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 md:px-0 py-3">

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-blue-100 order-1 md:order-2 hover:scale-[1.03] transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Order Summary
          </h3>

          <div className="space-y-4 text-sm max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-md relative"
              >
                {!buyNowItem && (
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={(e) => (e.target.src = "/placeholder.jpeg")}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500">{item.author}</p>
                  <p className="text-sm text-blue-700 font-medium mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right text-lg text-blue-800 font-semibold">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>

        {/* Delivery Form */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-blue-100 order-2 md:order-1 hover:scale-[1.03] transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <PackageCheck className="w-5 h-5" />
            Delivery Details
          </h3>

          {["name", "email", "address", "city", "postalCode"].map((field) => (
            <div className="mb-3 relative" key={field}>
              <label className="block mb-1 text-sm font-medium capitalize text-gray-700">
                {field === "postalCode" ? "Postal Code" : field}
              </label>

              <div className="relative">
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 rounded-lg shadow-sm text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-red-400 focus:ring-red-300"
                      : "border border-gray-300 focus:ring-blue-400"
                  }`}
                />
                {form[field].trim() && !errors[field] && (
                  <CheckCircle
                    className="w-5 h-5 text-green-500 absolute right-3 top-1/4 pointer-events-none animate-zoom-in"
                    strokeWidth={2}
                  />
                )}
              </div>

              <p
                className={`text-xs mt-1 min-h-[1rem] transition-all duration-200 ${
                  errors[field] ? "text-red-500" : "text-transparent"
                }`}
              >
                {errors[field] || "placeholder"}
              </p>
            </div>
          ))}

          <div className="text-right mt-6">
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition shadow-sm"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
