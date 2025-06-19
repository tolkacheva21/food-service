import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './components/AuthContext';
import DishList from './components/dishlist/DishList';
import LoginForm from './components/auth/AuthForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<DishList />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={
              <PrivateRoute roles={['ADMIN']}>
                <DishList isAdmin={true} />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
