import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import { getKuisList, getSoalByKuisId } from '../../../services/dataService';
import '../../../styles/icons.css';
import './Kuis.css';

function Kuis() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('semua');
  const [kuisData, setKuisData] = useState([]);
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

  // Load kuis dari localStorage
  useEffect(() => {
    const dataFromGuru = getKuisList();
    // Filter hanya kuis yang aktif untuk siswa
    const activeKuis = dataFromGuru.filter(k => k.status === 'Aktif');
    
    // Map data dari guru ke format siswa
    const mappedData = activeKuis.map(kuis => {
      const soalList = getSoalByKuisId(kuis.id);
      return {
        id: kuis.id,
        judul: kuis.judul,
        mapel: kuis.kelas || 'Umum',
        guru: 'Guru Pengampu',
        soal: soalList.length || kuis.jumlahSoal,
        durasi: `${kuis.durasi} menit`,
        deadline: '7 hari lagi',
        status: 'aktif',
        nilai: null,
        iconType: 'quiz',
        color: '#4285F4'
      };
    });
    setKuisData(mappedData);
  }, []);

  const kuisDataDummy = [
    {
      id: 1,
      judul: 'Kuis Algoritma Dasar',
      mapel: 'Dasar Pemrograman',
      guru: 'Pak Ahmad Fauzi',
      soal: 20,
      durasi: '30 menit',
      deadline: '2 hari lagi',
      status: 'aktif',
      nilai: null,
      iconType: 'quiz',
      color: '#4285F4'
    },
  ];

  // Gabungkan data dari guru dengan dummy data jika perlu
  const allKuisData = kuisData.length > 0 ? kuisData : kuisDataDummy;

  const filteredKuis = allKuisData.filter(item => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'aktif') return item.status === 'aktif';
    if (activeFilter === 'selesai') return item.status === 'selesai';
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
              <div className="logo-icon icon-chart"></div>
              <h1 className="header-title">Kuis</h1>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'guest'} />
            <span className="user-name">{user?.name || 'Siswa'}</span>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'semua' ? 'active' : ''}`}
              onClick={() => setActiveFilter('semua')}
            >
              Semua Kuis
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'aktif' ? 'active' : ''}`}
              onClick={() => setActiveFilter('aktif')}
            >
              Aktif ({kuisData.filter(k => k.status === 'aktif').length})
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'selesai' ? 'active' : ''}`}
              onClick={() => setActiveFilter('selesai')}
            >
              Selesai ({kuisData.filter(k => k.status === 'selesai').length})
            </button>
          </div>

          {/* Kuis Grid */}
          <div className="kuis-grid">
            {filteredKuis.map(kuis => (
              <div key={kuis.id} className="kuis-card">
                <div className="kuis-header" style={{ background: `${kuis.color}15` }}>
                  <div className="kuis-icon" style={{ color: kuis.color }}>
                    <div className={`icon-${kuis.iconType}`}></div>
                  </div>
                  {kuis.status === 'selesai' && (
                    <div className="kuis-nilai-badge">
                      <span className="nilai-number">{kuis.nilai}</span>
                    </div>
                  )}
                </div>
                
                <div className="kuis-content">
                  <h3 className="kuis-judul">{kuis.judul}</h3>
                  <p className="kuis-mapel">{kuis.mapel}</p>
                  
                  <div className="kuis-meta">
                    <div className="meta-item">
                      <span className="meta-icon icon-quiz"></span>
                      <span className="meta-text">{kuis.soal} Soal</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon icon-clock"></span>
                      <span className="meta-text">{kuis.durasi}</span>
                    </div>
                  </div>

                  {kuis.status === 'aktif' && (
                    <div className="kuis-deadline">
                      <span className="deadline-icon icon-calendar"></span>
                      <span className="deadline-text">Deadline: {kuis.deadline}</span>
                    </div>
                  )}

                  <button 
                    className="btn-kuis-action" 
                    style={{ 
                      background: kuis.status === 'selesai' ? '#718096' : kuis.color 
                    }}
                    onClick={() => {
                      if (kuis.status === 'aktif') {
                        navigate(`/siswa/kuis/${kuis.id}/mulai`);
                      }
                    }}
                  >
                    {kuis.status === 'selesai' ? 'Lihat Hasil' : 'Kerjakan Kuis'}
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

export default Kuis;
