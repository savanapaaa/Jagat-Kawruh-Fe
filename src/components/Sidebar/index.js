import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/icons.css';
import './Sidebar.css';

function Sidebar({ role = 'siswa', isOpen = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const menuItems = {
    siswa: [
      { path: '/siswa/dashboard', iconType: 'chart', label: 'Dashboard' },
      { path: '/siswa/materi', iconType: 'book', label: 'Materi' },
      { path: '/siswa/kuis', iconType: 'quiz', label: 'Kuis' },
      { path: '/siswa/pbl', iconType: 'target', label: 'Problem Based Learning' },
      { path: '/siswa/nilai', iconType: 'trophy', label: 'Nilai' },
    ],
    guru: [
      { path: '/guru/dashboard', iconType: 'chart', label: 'Dashboard' },
      { path: '/guru/materi', iconType: 'book', label: 'Kelola Materi' },
      { path: '/guru/kuis', iconType: 'quiz', label: 'Kelola Kuis' },
      { path: '/guru/pbl', iconType: 'target', label: 'Kelola PBL' },
      { path: '/guru/nilai-siswa', iconType: 'trophy', label: 'Nilai Siswa' },
    ],
    admin: [
      { path: '/admin/dashboard', iconType: 'chart', label: 'Dashboard' },
    ],
  };

  const menus = menuItems[role] || menuItems.siswa;

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="Jagat Kawruh" className="sidebar-logo" />
        <h3>Jagat Kawruh</h3>
        <button className="sidebar-close" onClick={onClose}>✕</button>
      </div>

      <div className="sidebar-menu-title">
        Menu {role.charAt(0).toUpperCase() + role.slice(1)}
      </div>

      <nav className="sidebar-menu">
        {menus.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className={`menu-icon icon-${item.iconType}`}></span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn-sidebar" onClick={handleLogout}>
          <span className="menu-icon icon-logout"></span>
          <span className="menu-label">Keluar</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
