import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import DishForm from '../DishForm';
import './DishList.css'

const BASE_URL = 'http://localhost:8080/api';

export default function DishList({ isAdmin = false }) {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDishes();
  }, [filter]);

  const fetchDishes = async () => {
    try {
      const params = filter ? { name: filter } : {};
      const response = await axios.get(`${BASE_URL}/dishes/`, { 
        params,
        headers: {
          'Accept': 'application/json', // Явно запрашиваем JSON
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
      await axios.delete(`${BASE_URL}/dishes/admin/${id}`);
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentDish) {
        await axios.put(`${BASE_URL}/dishes/admin/${currentDish.id}`, values);
      } else {
        await axios.post(`${BASE_URL}/dishes/admin`, values);
      }
      setShowModal(false);
      fetchDishes();
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  return (
    <div className="dish-list-container">
    <div className="header">
      <h1>{isAdmin ? 'Admin: Dishes Management' : 'Menu'}</h1>
      {isAdmin && (
        <button className="btn btn-primary" onClick={handleCreate}>
          Add New Dish
        </button>
      )}
    </div>

    <input
      type="text"
      placeholder="Filter by name..."
      className="form-control"
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
            {isAdmin && (
              <div className="dish-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEdit(dish)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(dish.id)}
                >
                  Delete
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
          <h2>{currentDish ? 'Edit Dish' : 'Create Dish'}</h2>
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
