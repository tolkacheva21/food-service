import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const BASE_URL = 'http://localhost:8080/api/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const url = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/register`;
      const data = isLogin 
        ? { email, password }
        : { email, password, username };
      const response = await axios.post(url, data);
      
      if (isLogin) {
        // При успешном входе сохраняем токен (если бэкенд его возвращает)
        // и перенаправляем на главную
        navigate('/');
      } else {
        // После регистрации переключаем на форму входа
        setIsLogin(true);
        setError('Регистрация прошла успешно. Пожалуйста, войдите.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 
               (isLogin ? 'Ошибка входа' : 'Ошибка регистрации'));
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      {error && <div className={`message ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isLogin ? 'Войти' : 'Зарегестрироваться'}
        </button>
      </form>

      <div className="toggle-form">
        <p>
          {isLogin ? 'Еще нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button 
            type="button" 
            className="btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Зарегестрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}
