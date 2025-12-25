import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    { icon: '👥', label: 'Total Pengguna', value: '1,234', color: '#4285F4' },
    { icon: '👨‍🏫', label: 'Total Guru', value: '50', color: '#0F9D58' },
    { icon: '👨‍🎓', label: 'Total Siswa', value: '1,000', color: '#F4B400' },
    { icon: '📚', label: 'Total Materi', value: '200', color: '#DB4437' },
  ];

  const aktivitasTerbaru = [
    { id: 1, icon: '✓', text: 'Guru baru terdaftar: Ahmad Fauzi', time: '5 menit yang lalu', color: '#0F9D58' },
    { id: 2, icon: '✓', text: 'Materi baru ditambahkan: Matematika Kelas 10', time: '15 menit yang lalu', color: '#4285F4' },
    { id: 3, icon: '✓', text: '10 siswa baru terdaftar', time: '1 jam yang lalu', color: '#F4B400' },
    { id: 4, icon: '✓', text: 'Update sistem berhasil', time: '2 jam yang lalu', color: '#DB4437' },
  ];

  const usersByRole = [
    { role: 'Admin', count: 5, percentage: 0.4, color: '#DB4437' },
    { role: 'Guru', count: 50, percentage: 4, color: '#0F9D58' },
    { role: 'Siswa', count: 1000, percentage: 95.6, color: '#4285F4' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header-bar">
          <div className="header-left">
            <h1 className="header-title">Dashboard Admin</h1>
            <p className="header-date">{getCurrentDate()}</p>
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

        {/* Content */}
        <div className="dashboard-content-area">
          {/* Stats Cards */}
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card-admin">
                <div className="stat-icon-admin" style={{ background: `${stat.color}15` }}>
                  <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                </div>
                <div className="stat-info-admin">
                  <p className="stat-label-admin">{stat.label}</p>
                  <h3 className="stat-value-admin">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="content-grid-two">
            {/* Aktivitas Terbaru */}
            <div className="content-card">
              <div className="card-header">
                <h2>Aktivitas Terbaru</h2>
                <a href="#" className="link-detail">Lihat Semua</a>
              </div>
              <div className="activity-list">
                {aktivitasTerbaru.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon-wrapper" style={{ background: `${activity.color}15` }}>
                      <span style={{ color: activity.color, fontWeight: 'bold' }}>{activity.icon}</span>
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.text}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribusi Pengguna */}
            <div className="content-card">
              <div className="card-header">
                <h2>Distribusi Pengguna</h2>
                <a href="#" className="link-detail">Detail</a>
              </div>
              <div className="user-distribution">
                {usersByRole.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <div className="distribution-header">
                      <span className="distribution-role">{item.role}</span>
                      <span className="distribution-count">{item.count}</span>
                    </div>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill" 
                        style={{ width: `${item.percentage}%`, background: item.color }}
                      ></div>
                    </div>
                    <span className="distribution-percentage">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
