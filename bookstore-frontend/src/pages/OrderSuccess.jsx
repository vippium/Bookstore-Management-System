import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";


export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">Thank you for your order!</h1>
      <p className="text-gray-600 mb-6">
        Your books will be on their way soon. You can view your orders or continue shopping below.
      </p>

      <div className="flex gap-4">
        <Link
          to="/my-orders"
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          View Orders
        </Link>
        <Link
          to="/"
          className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
