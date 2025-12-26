import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import '../../../styles/icons.css';
import './GuruDashboard.css';

function GuruDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { icon: 'book', label: 'Materi Saya', value: '25', color: '#4285F4' },
    { icon: 'quiz', label: 'Tugas Aktif', value: '12', color: '#0F9D58' },
    { icon: 'user', label: 'Total Siswa', value: '150', color: '#F4B400' },
    { icon: 'check', label: 'Perlu Diperiksa', value: '8', color: '#DB4437' },
  ];

  const tugasTerbaru = [
    { 
      id: 1, 
      judul: 'Matematika - Trigonometri',
      deadline: '2 hari lagi',
      submission: 8,
      total: 30,
      color: '#4285F4'
    },
    { 
      id: 2, 
      judul: 'Fisika - Gerak Lurus',
      deadline: '5 hari lagi',
      submission: 12,
      total: 30,
      color: '#0F9D58'
    },
    { 
      id: 3, 
      judul: 'Kimia - Ikatan Kimia',
      deadline: '1 minggu lagi',
      submission: 25,
      total: 30,
      color: '#F4B400'
    },
  ];

  const kelasSaya = [
    { nama: 'X RPL 1', siswa: 30, materi: 8, color: '#4285F4' },
    { nama: 'X RPL 2', siswa: 32, materi: 8, color: '#0F9D58' },
    { nama: 'XI RPL 1', siswa: 28, materi: 10, color: '#F4B400' },
    { nama: 'XI RPL 2', siswa: 30, materi: 10, color: '#DB4437' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header-bar">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1 className="header-title">Dashboard Guru</h1>
              <p className="header-date">{getCurrentDate()}</p>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'guru'} />
            <div className="user-menu">
              <span className="user-name">{user?.name || 'Guru'}</span>
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
                  <span className={`icon-${stat.icon}`} style={{ fontSize: '32px', color: stat.color }}></span>
                </div>
                <div className="stat-info-admin">
                  <p className="stat-label-admin">{stat.label}</p>
                  <h3 className="stat-value-admin">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="content-grid-two">
            {/* Tugas Terbaru */}
            <div className="content-card">
              <div className="card-header">
                <h2>Tugas Terbaru</h2>
                <a href="#" className="link-detail">Lihat Semua</a>
              </div>
              <div className="tugas-guru-list">
                {tugasTerbaru.map(tugas => (
                  <div key={tugas.id} className="tugas-guru-item">
                    <div className="tugas-guru-header">
                      <h4>{tugas.judul}</h4>
                      <span className="tugas-deadline">{tugas.deadline}</span>
                    </div>
                    <div className="tugas-progress-section">
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${(tugas.submission / tugas.total) * 100}%`,
                              background: tugas.color
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="progress-text-small">
                        {tugas.submission}/{tugas.total} submission
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kelas Saya */}
            <div className="content-card">
              <div className="card-header">
                <h2>Kelas Saya</h2>
                <a href="#" className="link-detail">Detail</a>
              </div>
              <div className="kelas-grid">
                {kelasSaya.map((kelas, index) => (
                  <div key={index} className="kelas-card" style={{ borderColor: kelas.color }}>
                    <h4 className="kelas-nama">{kelas.nama}</h4>
                    <div className="kelas-info">
                      <div className="kelas-info-item">
                        <span className="kelas-icon icon-user"></span>
                        <span className="kelas-value">{kelas.siswa} Siswa</span>
                      </div>
                      <div className="kelas-info-item">
                        <span className="kelas-icon icon-book"></span>
                        <span className="kelas-value">{kelas.materi} Materi</span>
                      </div>
                    </div>
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

export default GuruDashboard;
