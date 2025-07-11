import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import api from "../services/axios";
import toast from "react-hot-toast";
import {
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Trash2,
  CalendarDays,
  MailCheck,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("info");
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [changing, setChanging] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (name === "new") updatePasswordStrength(value);
  };

  const updatePasswordStrength = (pwd) => {
    if (!pwd) return setPasswordStrength("");
    if (pwd.length < 6) return setPasswordStrength("weak");
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return setPasswordStrength("strong");
    return setPasswordStrength("medium");
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/auth/update", form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordForm.current || !passwordForm.new)
      return toast.error("Both fields are required");

    setChanging(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      });
      toast.success("Password updated");
      setPasswordForm({ current: "", new: "" });
      setPasswordStrength("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/auth/delete");
      toast.success("Account deleted");
      logout();
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const getCheck = (field) =>
    form[field].trim() && (
      <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
    );

  return (
    <div className="max-w-xl mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">👤 Manage Profile</h2>

      {/* Tabs */}
      <div className="flex gap-3 border-b mb-6 text-sm">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-3 py-1.5 font-medium rounded-t ${activeTab === "info"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
            }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-3 py-1.5 font-medium rounded-t ${activeTab === "password"
            ? "text-yellow-600 border-b-2 border-yellow-500"
            : "text-gray-500"
            }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("danger")}
          className={`px-3 py-1.5 font-medium rounded-t ${activeTab === "danger"
            ? "text-red-600 border-b-2 border-red-500"
            : "text-gray-500"
            }`}
        >
          Danger Zone
        </button>
      </div>

      {/* Info Tab */}
      {activeTab === "info" && (
        <div className="space-y-4 bg-white border border-blue-100 p-5 rounded-xl shadow">
          <div className="flex items-center gap-2 text-sm">
            {user?.isVerified ? (
              <span className="flex items-center gap-1 text-green-600">
                <MailCheck className="w-4 h-4" /> Verified Email
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle className="w-4 h-4" /> Not Verified
              </span>
            )}
          </div>

          {["name", "email"].map((field) => (
            <div className="relative" key={field}>
              <label className="text-sm font-medium capitalize block mb-1">
                {field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleInput}
                className="w-full px-4 py-2 border rounded-lg shadow-sm text-sm border-gray-300 focus:ring-blue-400 focus:outline-none"
              />
              {getCheck(field)}
            </div>
          ))}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium disabled:opacity-50 mt-2"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="space-y-4 bg-white border border-yellow-100 p-5 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-2 text-yellow-600 font-semibold">
            <Lock className="w-4 h-4" /> Change Password
          </div>

          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={passwordForm.current}
            onChange={handlePasswordInput}
            className="w-full px-4 py-2 border rounded-lg text-sm border-gray-300 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            type="password"
            name="new"
            placeholder="New Password"
            value={passwordForm.new}
            onChange={handlePasswordInput}
            className="w-full px-4 py-2 border rounded-lg text-sm border-gray-300 focus:ring-yellow-400 focus:outline-none"
          />

          {/* Strength Meter */}
          {passwordStrength && (
            <div
              className={`text-xs mt-1 font-medium ${passwordStrength === "weak"
                ? "text-red-500"
                : passwordStrength === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
                }`}
            >
              Strength: {passwordStrength}
            </div>
          )}

          <button
            onClick={changePassword}
            disabled={changing}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-full font-medium disabled:opacity-50"
          >
            {changing ? "Changing..." : "Change Password"}
          </button>
        </div>
      )}

      {/* Danger Tab */}
      {activeTab === "danger" && (
        <div className="space-y-4 bg-white border border-red-100 p-5 rounded-xl shadow">
          <div className="text-red-600 font-semibold flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Delete Account
          </div>

          <p className="text-sm text-gray-600">
            This action is irreversible. Your account and all data will be permanently removed.
          </p>

          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-medium"
          >
            Delete Account
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center space-y-4">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete your account? This cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-1.5 rounded-full border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="px-4 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-500 flex gap-4 mt-6">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          Joined: {new Date(user?.createdAt).toLocaleDateString()}
        </div>
        {user?.lastLogin && (
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Last Login: {new Date(user.lastLogin).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
