import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="navbar-brand">Food Service</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Меню</Link>
          {user?.roles?.includes('ADMIN') && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
        </div>
        <div>
          {user ? (
            <button onClick={logout} className="btn">Выйти</button>
          ) : (
            <Link to="/login" className="btn">Войти</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
