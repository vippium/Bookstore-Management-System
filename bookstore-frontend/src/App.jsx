import {BrowserRouter as Router,Routes,Route,Navigate,} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import BookDetails from "./pages/BookDetails";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import EditBook from "./pages/EditBook";
import AddBook from "./pages/AddBook";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";


// New unified route guard
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Protected Routes (any authenticated user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Only */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books/:id/edit" element={<EditBook />} />
          <Route path="/admin/books/new" element={<AddBook />} />

        </Route>
      </Routes>
    </Router>
  );
}
