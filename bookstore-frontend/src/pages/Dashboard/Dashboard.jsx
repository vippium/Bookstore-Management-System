import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { UserCircle, ListOrdered, BarChartBig, User2 } from "lucide-react";
import MyOrders from "./MyOrders";
import UserOrdersChart from "../../components/UserOrdersChart";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="relative bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:shadow-xl hover:ring-1 hover:ring-blue-500 transition-all hover:scale-[1.02] duration-300">

        {/* 🏷️ Role Badge */}
        <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1 bg-blue-100 text-blue-700">
          <User2 className="w-3.5 h-3.5" />
          Customer
        </span>

        <div className="flex items-center gap-3 mb-4">
          <UserCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">User Info</h2>
        </div>

        <p className="flex items-center gap-2">
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <div className="mt-4 flex gap-4">
          <button
            onClick={() => (window.location.href = "/profile")}
            className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => alert("⚠️ Add delete logic")}
            className="px-4 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition font-medium"
          >
            Delete Account
          </button>
        </div>

      </div>


      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <ListOrdered className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">My Orders</h2>
        </div>
        <MyOrders />
      </div>

      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-[1.02] duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <BarChartBig className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">Order Summary</h2>
          <UserOrdersChart />
        </div>
      </div>
    </div>
  );
}
