import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import {ShoppingCart,LogOut,LogIn,LayoutDashboard,User2,ChevronDown,UserRoundPlus} from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass =
    "relative flex items-center gap-1 transition text-sm px-1 py-1 hover:text-blue-600";
  const getActiveClass = ({ isActive }) =>
    isActive
      ? `text-blue-700 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700 after:rounded-full after:animate-fade-in ${linkClass}`
      : `text-gray-700 ${linkClass}`;

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <NavLink to="/" className="text-2xl font-bold text-blue-700">
          📚 Vipin's Bookstore
        </NavLink>

        <div className="flex items-center gap-6 text-sm relative">
          {isLoggedIn ? (
            <>
              
              {/* Dashboard link */}
              <NavLink
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className={getActiveClass}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>

              {/* Cart link with item count */}
              <NavLink to="/cart" className={getActiveClass}>
                <div className="relative flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                      {cartCount}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* Username dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <User2 className="w-4 h-4" />
                  Hi, {user.name}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-md text-sm z-50">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50"
                    >
                      Manage Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </>
          ) : (
            <>
              <NavLink to="/login" className={getActiveClass}>
                <LogIn className="w-4 h-4" />
                Login
              </NavLink>
              <NavLink to="/register" className={getActiveClass}>
                <UserRoundPlus className="w-4 h-4" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
