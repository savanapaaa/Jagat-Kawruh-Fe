import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import { getSiswaList, getKuisList, getMateriList } from '../../../services/dataService';
import '../../../styles/icons.css';
import './AdminDashboard.css';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalMateri: 0,
    totalKuis: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const siswaList = getSiswaList();
    const kuisList = getKuisList();
    const materiList = getMateriList();
    
    setStats({
      totalSiswa: siswaList.length,
      totalGuru: 12,
      totalMateri: materiList.length,
      totalKuis: kuisList.length
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCurrentDate = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const statsData = [
    { icon: 'user', label: 'Total Siswa', value: stats.totalSiswa, color: '#4285F4', link: '/admin/siswa' },
    { icon: 'user', label: 'Total Guru', value: stats.totalGuru, color: '#0F9D58', link: '#' },
    { icon: 'book', label: 'Total Materi', value: stats.totalMateri, color: '#F4B400', link: '#' },
    { icon: 'quiz', label: 'Total Kuis', value: stats.totalKuis, color: '#DB4437', link: '#' },
  ];

  const quickActions = [
    { icon: 'plus', label: 'Tambah Siswa', action: () => navigate('/admin/siswa'), color: '#4285F4' },
    { icon: 'plus', label: 'Tambah Guru', action: () => alert('Fitur dalam pengembangan'), color: '#0F9D58' },
    { icon: 'folder', label: 'Kelola Kelas', action: () => alert('Fitur dalam pengembangan'), color: '#F4B400' },
    { icon: 'chart', label: 'Lihat Laporan', action: () => alert('Fitur dalam pengembangan'), color: '#DB4437' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="dashboard-main">
        <div className="dashboard-header-bar">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1 className="header-title">Dashboard Admin</h1>
              <p className="header-date">{getCurrentDate()}</p>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'admin'} />
            <div className="user-menu">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <button className="logout-btn-small" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-content">
              <h2>Selamat Datang, {user?.name || 'Admin'}!</h2>
              <p>Kelola sistem pembelajaran Jagat Kawruh dengan mudah</p>
            </div>
            <div className="welcome-icon icon-chart"></div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card-admin"
                onClick={() => stat.link !== '#' && navigate(stat.link)}
                style={{ cursor: stat.link !== '#' ? 'pointer' : 'default' }}
              >
                <div className="stat-icon-admin" style={{ background: `${stat.color}15` }}>
                  <span className={`icon-${stat.icon}`} style={{ fontSize: '32px', color: stat.color }}></span>
                </div>
                <div className="stat-info-admin">
                  <p className="stat-label-admin">{stat.label}</p>
                  <h3 className="stat-value-admin">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">Aksi Cepat</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <div 
                  key={index} 
                  className="quick-action-card"
                  onClick={action.action}
                >
                  <div className="action-icon-wrapper" style={{ background: `${action.color}15` }}>
                    <span className={`icon-${action.icon}`} style={{ color: action.color }}></span>
                  </div>
                  <p className="action-label">{action.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h2 className="section-title">Aktivitas Terkini</h2>
            <div className="activity-card">
              <div className="activity-empty">
                <div className="empty-icon icon-calendar"></div>
                <p>Belum ada aktivitas terbaru</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

