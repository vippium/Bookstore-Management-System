import { createContext, useState, useEffect } from "react";
import api from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout(false);
          setLoadingAuth(false);
          return;
        }
      } catch {
        logout(false);
        setLoadingAuth(false);
        return;
      }

      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          setIsLoggedIn(true);
        })
        .catch(() => logout(false))
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user, message, userId } = res.data;

      if (message?.includes("Email not verified")) {
        toast.error("Please verify your email before logging in.");
        return { success: false, userId, email, message };
      }

      if (token) {
        if (remember) localStorage.setItem("token", token);
        else sessionStorage.setItem("token", token);
      }

      setUser(user);
      setIsLoggedIn(true);
      toast.success("Logged in successfully!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, message: err.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { success, userId } = res.data;

      if (success) {
        toast.success("Registered successfully. Please verify your email.");
        return { success: true, userId, email };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return { success: false, message: err.response?.data?.message };
    }
  };

  const verifyOtp = async (userId, otp) => {
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        setIsLoggedIn(true);
        toast.success("Email verified successfully!");
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      return { success: false };
    }
  };

  const resendOtp = async (userId) => {
    try {
      await api.post("/auth/resend-otp", { userId });
      toast.success("OTP resent to your email!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
      return { success: false };
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);

    if (showToast) toast.success("Logged out successfully!");
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/auth/delete");
      logout(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        loadingAuth,
        register,
        verifyOtp,
        resendOtp,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
