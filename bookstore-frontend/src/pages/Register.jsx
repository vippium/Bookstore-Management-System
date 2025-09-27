import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  Loader,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") updatePasswordStrength(value);
  };

  const updatePasswordStrength = (pwd) => {
    if (!pwd) return setPasswordStrength("");
    if (pwd.length < 6) return setPasswordStrength("weak");
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return setPasswordStrength("strong");
    return setPasswordStrength("medium");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (passwordStrength === "weak") errs.password = "Password is too weak";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const res = await register(form.name, form.email, form.password);

    if (res.success) {
      navigate("/verify-otp", {
        state: { userId: res.userId, email: form.email },
      });
    } else {
      setErrors({ email: res.message });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex items-start justify-center pt-28 bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-blue-100 animate-fade-in-up">
        <div className="flex flex-col items-center mb-3">
          <ShieldCheck className="w-11 h-11 text-blue-600 mb-1" />
          <h2 className="text-xl font-bold text-blue-700">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Enter your details to sign up
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm border-gray-300 text-base"
                placeholder="John Doe"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm border-gray-300 text-base"
                placeholder="your@email.com"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pl-10 border rounded-xl shadow-sm border-gray-300 text-base"
                placeholder="Create a strong password"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {passwordStrength && (
              <p
                className={`text-xs mt-1 ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Strength: {passwordStrength}
              </p>
            )}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
          <p className="text-sm text-gray-600 text-center">
            Already have account :{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
