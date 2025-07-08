// src/components/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Not logged in → to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role mismatch handling
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
