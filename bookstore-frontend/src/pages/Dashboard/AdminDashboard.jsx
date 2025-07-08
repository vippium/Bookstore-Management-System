import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import BookManager from "../../components/BookManager";
import {
  UserCircle,
  ShieldCheck,
  User2,
  ListOrdered,
  BarChartBig,
  Book,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">

      {/* Admin Info Card */}
      <div className="relative bg-white border border-blue-100 rounded-3xl shadow-md p-6 hover:shadow-xl hover:ring-1 hover:ring-blue-500 transition-all hover:scale-105 duration-300">
        {/* Role Badge */}
        <span
          className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1
            ${
              user?.role === "admin"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
        >
          {user?.role === "admin" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrator
            </>
          ) : (
            <>
              <User2 className="w-3.5 h-3.5" />
              Customer
            </>
          )}
        </span>

        <div className="flex items-center gap-3 mb-4">
          <UserCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">Admin Info</h2>
        </div>

        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>

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

      {/* Book Manager Card */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-105 duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">Manage Books</h2>
        </div>
        <BookManager />
      </div>

      {/* Manage Orders */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-105 duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <ListOrdered className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">Manage Orders</h2>
        </div>
        <p className="text-sm text-gray-500">
          📦 Order management interface will be added here soon.
        </p>
      </div>

      {/* Analytics */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:scale-105 duration-300 hover:shadow-xl hover:ring-1 hover:ring-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <BarChartBig className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-700">Site Analytics</h2>
        </div>
        <p className="text-sm text-gray-500">
          📊 Summary stats will be available soon.
        </p>
      </div>

    </div>
  );
}
