import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Eye, EyeOff, LogIn, Mail, Lock, Loader } from "lucide-react"; // Added Mail, Lock, Loader icons
import toast from "react-hot-toast"; // For toast notifications

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await login(form.email, form.password, remember);
      if (success) {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        setErrors({ password: "Invalid credentials" });
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-blue-100 animate-fade-in-up">
        {/* Login Header */}
        <div className="flex flex-col items-center mb-8">
          <LogIn className="w-16 h-16 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-blue-700 text-center">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-2">Log in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                  ${errors.email
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-400"
                  }`}
                placeholder="your.email@example.com"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 text-base transition-all duration-200
                  ${errors.password
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-400"
                  }`}
                placeholder="Enter your password"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="select-none">Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register Link */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
