import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const BASE_URL = 'http://localhost:8080/api/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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
        : { email, password, name };
      const response = await axios.post(url, data);
      
      if (isLogin) {
        // Сохраняем токен в localStorage
        const token = response.data.token;
        localStorage.setItem('jwtToken', token);
        
        // Добавляем токен в заголовки axios по умолчанию
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // перенаправляем на главную
        navigate('/');
        window.location.reload();
      } else {
        // После регистрации переключаем на форму входа
        setIsLogin(true);
        alert('Регистрация прошла успешно. Пожалуйста, войдите.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 
               (isLogin ? 'Ошибка входа' : 'Ошибка регистрации'));
    }
  };

  // Добавляем интерцептор для автоматической подстановки токена
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            minLength="3"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
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
