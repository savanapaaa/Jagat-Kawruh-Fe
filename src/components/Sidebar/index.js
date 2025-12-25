import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role = 'siswa', isOpen = false, onClose }) {
  const location = useLocation();

  const menuItems = {
    siswa: [
      { path: '/siswa/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/siswa/materi', icon: '📚', label: 'Materi' },
      { path: '/siswa/kuis', icon: '📝', label: 'Kuis' },
      { path: '/siswa/pbl', icon: '🎯', label: 'Problem Based Learning' },
      { path: '/siswa/nilai', icon: '🏆', label: 'Nilai' },
    ],
    guru: [
      { path: '/guru/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/guru/materi', icon: '📚', label: 'Kelola Materi' },
      { path: '/guru/kuis', icon: '📝', label: 'Kelola Kuis' },
      { path: '/guru/pbl', icon: '🎯', label: 'Kelola PBL' },
      { path: '/guru/siswa', icon: '👨‍🎓', label: 'Data Siswa' },
      { path: '/guru/nilai-siswa', icon: '🏆', label: 'Nilai Siswa' },
    ],
    admin: [
      { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/admin/users', icon: '👥', label: 'Kelola Users' },
      { path: '/admin/materi', icon: '📚', label: 'Kelola Materi' },
      { path: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
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
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
