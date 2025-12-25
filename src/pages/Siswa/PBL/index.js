import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import { getPBLList, getPBLProgress } from '../../../services/dataService';
import './PBL.css';

function PBL() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pblData, setPblData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('semua');

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

  useEffect(() => {
    const pblList = getPBLList();
    const userProgress = getPBLProgress(user?.email || 'guest');
    
    const activePBL = pblList.filter(p => p.status === 'Aktif');
    
    const mappedData = activePBL.map(pbl => {
      const progress = userProgress[pbl.id] || { progress: 0, status: 'belum', currentSintaks: 1, currentTahap: 1 };
      
      return {
        id: pbl.id,
        judul: pbl.judul,
        kelas: pbl.kelas,
        deadline: pbl.deadline,
        deskripsi: pbl.deskripsi,
        progress: progress.progress || 0,
        status: progress.status || 'belum',
        currentSintaks: progress.currentSintaks || 1,
        currentTahap: progress.currentTahap || 1,
        totalSintaks: 5,
        icon: '🎯',
        color: progress.status === 'selesai' ? '#48BB78' : progress.status === 'sedang' ? '#4299E1' : '#D4AF37',
      };
    });
    
    setPblData(mappedData);
  }, [user]);

  const filteredPBL = pblData.filter(item => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'sedang') return item.status === 'sedang';
    if (activeFilter === 'selesai') return item.status === 'selesai';
    if (activeFilter === 'belum') return item.status === 'belum';
    return true;
  });

  const getDeadlineInfo = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Telah lewat', color: '#EF4444' };
    if (diffDays === 0) return { text: 'Hari ini', color: '#F59E0B' };
    if (diffDays <= 3) return { text: `${diffDays} hari lagi`, color: '#F59E0B' };
    return { text: `${diffDays} hari lagi`, color: '#10B981' };
  };

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
            <div>
              <h1 className="header-title">Problem Based Learning</h1>
              <p className="header-date">{getCurrentDate()}</p>
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
              Semua Project
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'sedang' ? 'active' : ''}`}
              onClick={() => setActiveFilter('sedang')}
            >
              Sedang Dikerjakan
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

          {/* PBL Grid */}
          <div className="pbl-grid-siswa">
            {filteredPBL.map(pbl => {
              const deadlineInfo = getDeadlineInfo(pbl.deadline);
              
              return (
                <div key={pbl.id} className="pbl-card-siswa">
                  <div className="pbl-card-header">
                    <div className="pbl-icon-large" style={{ background: `${pbl.color}15` }}>
                      <span style={{ fontSize: '32px' }}>{pbl.icon}</span>
                    </div>
                    <div className="deadline-badge" style={{ color: deadlineInfo.color, borderColor: deadlineInfo.color }}>
                      ⏰ {deadlineInfo.text}
                    </div>
                  </div>

                  <h3 className="pbl-card-title">{pbl.judul}</h3>
                  <p className="pbl-card-kelas">📖 {pbl.kelas}</p>
                  <p className="pbl-card-desc">{pbl.deskripsi}</p>

                  <div className="pbl-progress-info">
                    <div className="progress-label">
                      <span>Progress: Sintaks {pbl.currentSintaks} - Tahap {pbl.currentTahap}</span>
                      <span className="progress-percent">{pbl.progress}%</span>
                    </div>
                    <div className="progress-bar-pbl">
                      <div 
                        className="progress-fill-pbl" 
                        style={{ width: `${pbl.progress}%`, background: pbl.color }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    className="btn-pbl-action" 
                    style={{ background: pbl.color }}
                    onClick={() => navigate(`/siswa/pbl/${pbl.id}/kerjakan`)}
                  >
                    {pbl.status === 'selesai' ? '✅ Lihat Hasil' : pbl.status === 'sedang' ? '▶️ Lanjutkan' : '🚀 Mulai Kerjakan'}
                  </button>
                </div>
              );
            })}

            {filteredPBL.length === 0 && (
              <div className="empty-state-siswa">
                <div className="empty-icon">🎯</div>
                <h3>Belum Ada Project PBL</h3>
                <p>Guru belum membuat project Problem Based Learning untuk kelas Anda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PBL;
