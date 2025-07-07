import { Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';


function App() {
  const { user, isLoggedIn, loading } = useContext(AuthContext);
  
  if (loading) return null;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={isLoggedIn && user?.role === 'admin' ? (<Admin />) : (<Navigate to="/login" />)}/>
      </Routes>
    </>
  );
}

export default App;
