import { createContext, useState, useEffect } from "react";
import api from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast"; // Keep toast import for logout and error messages

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired, logging out.");
          logout(); // This logout will also show a toast
          setLoadingAuth(false);
          return;
        }
      } catch (e) {
        console.error("Invalid token, logging out:", e);
        logout(); // This logout will also show a toast
        setLoadingAuth(false);
        return;
      }

      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user on mount:", error);
          logout(); // This logout will also show a toast
        })
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      const userRes = await api.get("/auth/me");
      setUser(userRes.data.user);
      setIsLoggedIn(true);
      // Removed: toast.success("Logged in successfully!"); // This was causing the double toast
      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token } = res.data;

      localStorage.setItem("token", token);

      const userRes = await api.get("/auth/me");
      setUser(userRes.data.user);
      setIsLoggedIn(true);
      toast.success("Registered and logged in!");
      return true;
    } catch (err) {
      console.error("Registration failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("cart_synced");
    setUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, loadingAuth, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
