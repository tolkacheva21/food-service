import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
     <nav className="navbar">
      <div className="container">
        <h1 className="navbar-brand">Food Service</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Меню</Link>
          <Link to="/cart" className="nav-link">Корзина</Link>
          <Link to="/orders" className="nav-link">Мои заказы</Link>
          {user?.role === 'ROLE_ADMIN' && (
            <>
              <Link to="/admin" className="nav-link">Admin</Link>
              <Link to="/admin/orders" className="nav-link">Все заказы</Link>
            </>
          )}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} className="btn btn-logout">
              Выйти ({user.username || user.email})
            </button>
          ) : (
            <Link to="/login" className="btn">Войти</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
