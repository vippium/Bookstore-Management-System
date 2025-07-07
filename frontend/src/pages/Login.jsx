import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginUser } from '../services/authService';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await loginUser(email, password); // or `login` from authService
    login(res.token);  // ✅ updates global context
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
