import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4">User Information</h2>
      <div className="text-sm space-y-2">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold"
        >
          Edit Profile
        </button>
        <button
          className="px-4 py-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-full text-sm font-semibold"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
