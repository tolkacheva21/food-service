import { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const BASE_URL = 'http://localhost:8080/api/history';

export default function Cart({ cartItems, onRemoveItem, onUpdateQuantity }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Загружаем данные пользователя если есть токен
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
    }
  }, [token]);

  const createOrder = async () => {
    if (!token) {
      setError('Требуется авторизация');
      return;
    }

    if (cartItems.length === 0) {
      setError('Корзина пуста');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}`, 
        cartItems.map(item => ({ // Отправляем массив напрямую
          dishId: item.id,
          quantity: item.quantity
        })), 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
      });

      // Очищаем корзину после успешного заказа
      onRemoveItem(null, true);
      setError('');
      alert('Заказ успешно создан!');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания заказа');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  return (
    <div className="cart-container">
      <h2>Корзина</h2>
      
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.price}₽ x {item.quantity}</p>
                  <p>Сумма: {item.price * item.quantity}₽</p>
                </div>
                
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="btn-remove"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Итого: {total}₽</h3>
            {error && <p className="error">{error}</p>}
            
            <button 
              onClick={createOrder}
              disabled={loading || !user}
              className="btn-order"
            >
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
            
            {!user && (
              <p className="auth-warning">
                Для оформления заказа необходимо авторизоваться
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
