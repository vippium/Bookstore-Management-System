import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Home() {
  const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-green-700">
        📘 Home Page
      </h2>
      {isLoggedIn && (
        <p className="mt-2 text-gray-600">Welcome, {user.name}!</p>
      )}
    </div>
  );
}
