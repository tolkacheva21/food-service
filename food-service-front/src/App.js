import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './components/AuthContext';
import DishList from './components/dishlist/DishList';
import LoginForm from './components/auth/AuthForm';
import axios from 'axios';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<DishList />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={
              <DishList isAdmin={true} />
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
