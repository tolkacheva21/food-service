import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './components/AuthContext';
import DishList from './components/dishlist/DishList';
import LoginForm from './components/auth/AuthForm';
import Cart from './components/cart/Cart';
import OrderHistory from './components/orderhistory/OrderHistory';
import axios from 'axios';

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Удаление блюда из корзины
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Изменение количества блюда в корзине
  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  // Очистка корзины (например, после оформления заказа)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<DishList 
              isAdmin={false} 
              cartItems={cartItems} 
              setCartItems={setCartItems} />} 
            />
            <Route path="/cart" element={<Cart 
              cartItems={cartItems} 
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity} />} 
            />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={<DishList isAdmin={true} />} />
            <Route path="/admin/orders" element={<OrderHistory isAdmin={true} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
