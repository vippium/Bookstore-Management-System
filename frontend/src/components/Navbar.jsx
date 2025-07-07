import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-lg font-bold text-blue-600">
        <Link to="/">📚 Bookstore</Link>
      </div>

      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
