import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate login - replace with actual API call
    // In real app, backend will return user data including role
    // For demo: detect role based on email pattern
    let userRole = 'siswa'; // default
    if (formData.email.includes('admin')) {
      userRole = 'admin';
    } else if (formData.email.includes('guru')) {
      userRole = 'guru';
    }

    const userData = {
      email: formData.email,
      role: userRole,
      name: formData.email.split('@')[0]
    };

    login(userData);

    // Redirect based on role
    switch(userRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'guru':
        navigate('/guru/dashboard');
        break;
      case 'siswa':
        navigate('/siswa/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-container">
          <img src="/logo.png" alt="Jagat Kawruh" className="login-page-logo" />
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>Selamat Datang</h2>
            <p>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email atau Username</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email atau username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Ingat Saya</span>
              </label>
            </div>

            <button type="submit" className="login-button">
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
