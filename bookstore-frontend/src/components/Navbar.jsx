import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import {
  ShoppingCart,
  LogOut,
  LogIn,
  LayoutDashboard,
  Waypoints,
  User2,
  ChevronDown,
  UserRoundPlus,
  Heart,
  UserRoundPen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cartItems, loadingCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = loadingCart ? 0 : cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = "flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200";

  const getActiveClass = ({ isActive }) =>
    isActive
      ? `bg-blue-50 text-blue-700 font-semibold shadow-sm ${linkClass}`
      : `text-gray-700 hover:bg-gray-100 ${linkClass}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) setDropdownOpen(false);
  }, [isLoggedIn]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Bookstore Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <img src="/my-logo.png" alt="Bookstore Logo" className="w-8 h-8 object-contain" />
          Vipin's Bookstore
        </NavLink>

        <div className="flex items-center gap-4 text-sm relative">
          {isLoggedIn ? (
            <>
              {/* Dashboard / Admin Tools Link */}
              <NavLink
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className={getActiveClass}
              >
                {user.role === "admin" ? (
                  <Waypoints className="w-5 h-5" />
                ) : (
                  <LayoutDashboard className="w-5 h-5" />
                )}
                {user.role === "admin" ? "Admin Tools" : "Dashboard"}
              </NavLink>

              {/* Cart Link */}
              <NavLink to="/cart" className={getActiveClass}>
                <div className="relative flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {!loadingCart && cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
                >
                  <User2 className="w-5 h-5" />
                  Hi, {user.name.split(' ')[0]}
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg text-sm z-50 origin-top"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/wishlist");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 rounded-t-xl
                          ${location.pathname === "/wishlist" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                      >
                        <Heart className="w-4 h-4 text-pink-500" />
                        Wishlist
                      </button>

                      {/* Profile Button */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50
                          ${location.pathname === "/profile" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                      >
                        <UserRoundPen className="w-4 h-4" />
                        Manage Profile
                      </button>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-b-xl"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              {/* Login Link */}
              <NavLink to="/login" className={getActiveClass}>
                <LogIn className="w-5 h-5" />
                Login
              </NavLink>
              {/* Register Link */}
              <NavLink to="/register" className={getActiveClass}>
                <UserRoundPlus className="w-5 h-5" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}