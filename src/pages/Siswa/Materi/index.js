import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import { getMateriList, getMateriProgress } from '../../../services/dataService';
import '../../../styles/icons.css';
import './Materi.css';

function Materi() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('semua');
  const [materiData, setMateriData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Load materi dari localStorage
  useEffect(() => {
    const dataFromGuru = getMateriList();
    const userProgress = getMateriProgress(user?.email || 'guest');
    
    // Map data dari guru ke format siswa dengan progress dari tracking
    const mappedData = dataFromGuru.map((materi, index) => {
      const progress = userProgress[materi.id] || { status: 'belum', progress: 0 };
      
      return {
        id: materi.id,
        judul: materi.judul,
        mapel: materi.kelas || 'Umum',
        guru: 'Guru Pengampu',
        progress: progress.progress || 0,
        durasi: '45 menit',
        bab: `Bab ${index + 1}`,
        status: progress.status || 'belum',
        iconType: 'book',
        color: progress.status === 'selesai' ? '#48BB78' : progress.status === 'berjalan' ? '#4299E1' : '#D4AF37',
        deskripsi: materi.deskripsi,
        file: materi.file
      };
    });
    setMateriData(mappedData);
  }, [user]);

  const materiDataDummy = [
    {
      id: 1,
      judul: 'Pengenalan Algoritma',
      mapel: 'Dasar Pemrograman',
      guru: 'Pak Ahmad Fauzi',
      progress: 100,
      durasi: '45 menit',
      bab: 'Bab 1',
      status: 'selesai',
      thumbnail: '📚',
      color: '#4285F4'
    },
  ];

  // Gabungkan data dari guru dengan dummy data jika perlu
  const allMateriData = materiData.length > 0 ? materiData : materiDataDummy;

  const filteredMateri = allMateriData.filter(item => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'selesai') return item.status === 'selesai';
    if (activeFilter === 'berjalan') return item.status === 'berjalan';
    if (activeFilter === 'belum') return item.status === 'belum';
    return true;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="siswa" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="dashboard-main">
        <div className="dashboard-header-bar">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="header-brand">
              <div className="logo-icon icon-book"></div>
              <h1 className="header-title">Materi Pembelajaran</h1>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'guest'} />
            <div className="user-menu">
              <span className="user-name">{user?.name || 'Siswa'}</span>
              <button className="logout-btn-small" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'semua' ? 'active' : ''}`}
              onClick={() => setActiveFilter('semua')}
            >
              Semua Materi
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'berjalan' ? 'active' : ''}`}
              onClick={() => setActiveFilter('berjalan')}
            >
              Sedang Berjalan
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'selesai' ? 'active' : ''}`}
              onClick={() => setActiveFilter('selesai')}
            >
              Selesai
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'belum' ? 'active' : ''}`}
              onClick={() => setActiveFilter('belum')}
            >
              Belum Dimulai
            </button>
          </div>

          {/* Materi Grid */}
          <div className="materi-grid-page">
            {filteredMateri.map(materi => (
              <div key={materi.id} className="materi-card-page">
                <div className="materi-thumbnail" style={{ background: `${materi.color}15` }}>
                  <div className="materi-icon" style={{ color: materi.color }}>
                    <div className={`icon-${materi.iconType}`}></div>
                  </div>
                </div>
                <div className="materi-content">
                  <span className="materi-bab">{materi.bab}</span>
                  <h3 className="materi-judul">{materi.judul}</h3>
                  <p className="materi-mapel">{materi.mapel}</p>
                  <p className="materi-guru">
                    <span className="small-icon icon-user"></span>
                    {materi.guru}
                  </p>
                  
                  <div className="materi-meta">
                    <span className="materi-durasi">
                      <span className="small-icon icon-clock"></span>
                      {materi.durasi}
                    </span>
                  </div>

                  <div className="materi-progress-section">
                    <div className="progress-bar-materi">
                      <div 
                        className="progress-fill-materi" 
                        style={{ width: `${materi.progress}%`, background: materi.color }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{materi.progress}%</span>
                  </div>

                  <button 
                    className="btn-materi-action" 
                    style={{ background: materi.color }}
                    onClick={() => navigate(`/siswa/materi/${materi.id}`)}
                  >
                    {materi.status === 'selesai' ? 'Ulangi Materi' : materi.status === 'berjalan' ? 'Lanjutkan' : 'Mulai Belajar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Materi;
