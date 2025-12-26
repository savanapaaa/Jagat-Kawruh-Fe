import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import './SiswaDashboard.css';

function SiswaDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dummy data siswa
  const dataSiswa = {
    nama: 'Putra Wibawa',
    noAbsen: '12',
    kelas: 'X RPL 2',
    mataPelajaran: 'DasProgli',
    progress: 60,
  };

  const tugasTerbaru = [
    { 
      id: 1, 
      judul: 'Kuis Algoritma & Pemrograman',
      status: 'belum',
      icon: '📝',
      bgColor: '#E6F7ED'
    },
    { 
      id: 2, 
      judul: 'Project Algoritma & Pemrograman',
      status: 'selesai',
      nilai: 96,
      icon: '🏆',
      bgColor: '#FFF8E1'
    },
  ];

  const grafikData = [
    { 
      label: 'Materi', 
      nilai: 6, 
      total: 10,
      color: '#4285F4',
      selesai: 6,
      belumSelesai: 4
    },
    { 
      label: 'Kuis', 
      nilai: 6, 
      total: 10,
      color: '#0F9D58',
      selesai: 6,
      belumSelesai: 4
    },
    { 
      label: 'Project', 
      nilai: 8, 
      total: 10,
      color: '#F4B400',
      selesai: 8,
      belumSelesai: 2
    },
  ];

  const getCurrentDate = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="siswa" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
              <h1 className="header-title">{dataSiswa.kelas} | {dataSiswa.mataPelajaran}</h1>
              <p className="header-date">{getCurrentDate()}</p>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'guest'} />
            <div className="user-menu">
              <span className="user-name">{user?.name || dataSiswa.nama}</span>
              <button className="logout-btn-small" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="dashboard-content-area">
          <div className="content-grid-two">
            {/* Data Diri */}
            <div className="content-card">
              <div className="card-header">
                <h2>Data Diri</h2>
                <a href="#" className="link-detail">Lihat Detail</a>
              </div>
              <div className="data-diri-content">
                <div className="avatar-section">
                  <div className="avatar-circle">
                    <div className="avatar-icon">👤</div>
                    <div className="progress-ring">
                      <span className="progress-text">{dataSiswa.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="info-section">
                  <div className="info-row">
                    <span className="info-label">Nama</span>
                    <span className="info-value">{dataSiswa.nama}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">No. Absen</span>
                    <span className="info-value">{dataSiswa.noAbsen}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Kelas</span>
                    <span className="info-value">{dataSiswa.kelas}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tugas Terbaru */}
            <div className="content-card">
              <div className="card-header">
                <h2>Tugas Terbaru Anda</h2>
                <a href="#" className="link-detail">Lihat Detail</a>
              </div>
              <div className="tugas-list">
                {tugasTerbaru.map(tugas => (
                  <div 
                    key={tugas.id} 
                    className="tugas-card"
                    style={{ background: tugas.bgColor }}
                  >
                    <div className="tugas-icon">{tugas.icon}</div>
                    <div className="tugas-info">
                      <h4>{tugas.judul}</h4>
                      <p className="tugas-status">
                        {tugas.status === 'belum' ? 'Belum Selesai' : 'Selesai'}
                      </p>
                    </div>
                    {tugas.nilai && (
                      <div className="tugas-nilai">{tugas.nilai}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grafik Pembelajaran */}
          <div className="content-card">
            <h2>Grafik Pembelajaran</h2>
            <div className="grafik-grid">
              {grafikData.map((item, index) => (
                <div key={index} className="grafik-item">
                  <div className="circular-progress">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      {/* Background circle */}
                      <circle
                        cx="90"
                        cy="90"
                        r="70"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="20"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="90"
                        cy="90"
                        r="70"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={`${(item.nilai / item.total) * 440} 440`}
                        strokeLinecap="round"
                        transform="rotate(-90 90 90)"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                      {/* Center text */}
                      <text
                        x="90"
                        y="100"
                        textAnchor="middle"
                        fontSize="48"
                        fontWeight="700"
                        fill="#2C3539"
                      >
                        {item.nilai}
                      </text>
                    </svg>
                  </div>
                  <h3 className="grafik-label">{item.label}</h3>
                  <div className="grafik-legend">
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: item.color }}></span>
                      <span className="legend-text">Selesai</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#E2E8F0' }}></span>
                      <span className="legend-text">Belum Selesai</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiswaDashboard;
