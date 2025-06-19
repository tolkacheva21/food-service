import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';

const BASE_URL = 'http://localhost:8080/api/history';

export default function OrderHistory({ isAdmin = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${isAdmin ? '/admin' : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/history/admin/${orderId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка изменения статуса');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${BASE_URL}/history/admin/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка удаления заказа');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-history">
      <h2>{isAdmin ? 'Все заказы' : 'Мои заказы'}</h2>
      
      {orders.length === 0 ? (
        <p>Нет заказов</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Заказ #{order.id}</span>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Пользователь: {order.user?.username || 'Гость'}</p>
              </div>
              
              <div className="order-items">
                <h4>Блюда:</h4>
                <ul>
                  {order.dishes.map(dish => (
                    <li key={dish.id}>
                      {dish.name} - {dish.price}₽ x{dish.quantity || 1}
                    </li>
                  ))}
                </ul>
                <p className="total">
                  Итого: {order.dishes.reduce((sum, dish) => sum + (dish.price * (dish.quantity || 1)), 0)}₽
                </p>
              </div>
              
              {isAdmin && (
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value)}
                  >
                    <option value="NEW">Новый</option>
                    <option value="PROCESSING">В обработке</option>
                    <option value="DELIVERED">Доставлен</option>
                    <option value="CANCELLED">Отменен</option>
                  </select>
                  
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="btn-delete"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
