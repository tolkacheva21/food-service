import { useState, useEffect } from 'react';
import axios from 'axios';
import DishForm from '../dishform/DishForm';
import './DishList.css'

const BASE_URL = 'http://localhost:8080/api';

export default function DishList({ isAdmin = false, cartItems, setCartItems  }) {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchDishes();
  }, [filter]);

  const fetchDishes = async () => {
    try {
      const params = filter ? { name: filter } : {};
      const response = await axios.get(`${BASE_URL}/dishes`, { 
        params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        } 
      });
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const handleCreate = () => {
    setCurrentDish(null);
    setShowModal(true);
  };

  const handleEdit = (dish) => {
    setCurrentDish(dish);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/dishes/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentDish) {
        await axios.put(`${BASE_URL}/dishes/admin/${currentDish.id}`, values, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
      } else {
        await axios.post(`${BASE_URL}/dishes/admin`, values, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
      }
      setShowModal(false);
      fetchDishes();
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  const addToCart = (dish) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  return (
    <div className="dish-list-container">
    <div className="header">
      <h1>{isAdmin ? 'Admin: редактирование блюд' : 'Меню'}</h1>
      {isAdmin && (
        <button className="btn btn-primary" onClick={handleCreate}>
          Создать блюдо
        </button>
      )}
    </div>

    <input
      type="text"
      placeholder="Поиск по имени..."
      className="form-control-dishes"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />

    <div className="dish-list">
      {dishes.map(dish => (
        <div key={dish.id} className="dish-card">
          <img 
            src='images/burger.png'
            alt={dish.name} 
            className="dish-image"
          />
          <div className="dish-content">
            <h3 className="dish-name">{dish.name}</h3>
            <p className="dish-description">{dish.description}</p>
            <div className="dish-details">
              <span className="dish-price">{dish.price}₽</span>
              <span className="dish-weight">{dish.weight}г</span>
            </div>
            <button
              className='btn-add'
              onClick={() => addToCart(dish)}
              >
                Добавить в корзину
            </button>
            {isAdmin && (
              <div className="dish-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEdit(dish)}
                >
                  Изменить
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(dish.id)}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {showModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>{currentDish ? 'Редактировать блюдо' : 'Создать блюдо'}</h2>
          <DishForm
            initialValues={currentDish}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </div>
      </div>
    )}
  </div>
  );
};
