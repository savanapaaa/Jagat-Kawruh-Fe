import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import NotificationDropdown from '../../../components/NotificationDropdown';
import '../../../styles/icons.css';
import './SiswaDashboard.css';

function SiswaDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    tugasTerbaru: [],
    aktivitasTerkini: [],
    progress: { materi: 0, kuis: 0, project: 0 },
    stats: { totalSelesai: 0, belumSelesai: 0, progressTotal: 0 }
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadDashboardData = () => {
    const userEmail = user?.email || 'guest';
    
    // Load data dari localStorage
    const materiList = JSON.parse(localStorage.getItem('jagat_kawruh_materi') || '[]');
    const kuisList = JSON.parse(localStorage.getItem('jagat_kawruh_kuis') || '[]');
    const pblList = JSON.parse(localStorage.getItem('jagat_kawruh_pbl') || '[]');
    const materiProgress = JSON.parse(localStorage.getItem('jagat_kawruh_materi_progress') || '{}');
    const hasilKuis = JSON.parse(localStorage.getItem('hasil_kuis') || '[]');
    const pblProgress = JSON.parse(localStorage.getItem('jagat_kawruh_pbl_progress') || '{}');

    const userMateriProgress = materiProgress[userEmail] || {};
    const userPBLProgress = pblProgress[userEmail] || {};
    const userHasilKuis = hasilKuis.filter(h => h.userId === userEmail);

    // Hitung progress
    const materiSelesai = Object.values(userMateriProgress).filter(p => p.status === 'selesai').length;
    const kuisSelesai = userHasilKuis.length;
    const pblSelesai = Object.keys(userPBLProgress).filter(pblId => {
      const progress = userPBLProgress[pblId];
      return progress && Object.values(progress).every(sintaks => 
        sintaks.tahap1?.isCompleted && sintaks.tahap2?.isCompleted
      );
    }).length;

    const progressData = {
      materi: materiList.length > 0 ? Math.round((materiSelesai / materiList.length) * 100) : 0,
      kuis: kuisList.length > 0 ? Math.round((kuisSelesai / kuisList.length) * 100) : 0,
      project: pblList.length > 0 ? Math.round((pblSelesai / pblList.length) * 100) : 0
    };

    // Tugas terbaru
    const tugas = [];
    
    // Kuis belum dikerjakan
    kuisList.forEach(kuis => {
      const sudahDikerjakan = userHasilKuis.some(h => h.kuisId === kuis.id);
      if (!sudahDikerjakan) {
        tugas.push({
          id: kuis.id,
          tipe: 'kuis',
          judul: kuis.judul,
          status: 'Belum Selesai',
          deadline: '20 Des 2024',
          icon: 'quiz',
          bgColor: '#E8F5E9',
          badgeColor: '#4CAF50'
        });
      }
    });

    // PBL yang sudah dikerjakan (untuk tampilkan nilai)
    const nilaiPBL = JSON.parse(localStorage.getItem('jagat_kawruh_nilai_pbl') || '[]');
    const userNilaiPBL = nilaiPBL.filter(n => n.userId === userEmail);
    userNilaiPBL.slice(0, 1).forEach(nilai => {
      const pbl = pblList.find(p => p.id === nilai.pblId);
      if (pbl) {
        tugas.push({
          id: pbl.id,
          tipe: 'pbl',
          judul: pbl.judul,
          status: 'Selesai',
          nilai: nilai.nilai,
          deadline: '15 Des 2024',
          icon: 'trophy',
          bgColor: '#FFF3E0',
          badgeColor: '#FF9800'
        });
      }
    });

    // Materi dalam progress
    Object.keys(userMateriProgress).slice(0, 1).forEach(materiId => {
      const progress = userMateriProgress[materiId];
      const materi = materiList.find(m => m.id === parseInt(materiId));
      if (materi && progress.status === 'berjalan') {
        tugas.push({
          id: materi.id,
          tipe: 'materi',
          judul: materi.judul,
          status: 'Dalam Progress',
          progress: progress.progress || 70,
          icon: 'book',
          bgColor: '#E3F2FD',
          badgeColor: '#2196F3'
        });
      }
    });

    // Aktivitas terkini
    const aktivitas = [];
    
    userHasilKuis.slice(-1).forEach(hasil => {
      const kuis = kuisList.find(k => k.id === hasil.kuisId);
      if (kuis) {
        aktivitas.push({
          tipe: 'kuis',
          judul: `Menyelesaikan Kuis ${kuis.judul}`,
          waktu: getRelativeTime(hasil.tanggal),
          icon: 'check'
        });
      }
    });

    Object.keys(userPBLProgress).slice(0, 1).forEach(pblId => {
      const pbl = pblList.find(p => p.id === parseInt(pblId));
      if (pbl) {
        aktivitas.push({
          tipe: 'pbl',
          judul: `Mengumpulkan Project ${pbl.judul}`,
          waktu: '5 jam yang lalu',
          icon: 'trophy'
        });
      }
    });

    Object.keys(userMateriProgress).slice(0, 1).forEach(materiId => {
      const materi = materiList.find(m => m.id === parseInt(materiId));
      if (materi) {
        aktivitas.push({
          tipe: 'materi',
          judul: `Membaca Materi ${materi.judul}`,
          waktu: '1 hari yang lalu',
          icon: 'book'
        });
      }
    });

    const totalSelesai = materiSelesai + kuisSelesai + pblSelesai;
    const totalBelum = (materiList.length - materiSelesai) + (kuisList.length - kuisSelesai) + (pblList.length - pblSelesai);
    const totalAll = materiList.length + kuisList.length + pblList.length;
    const progressTotal = totalAll > 0 ? Math.round((totalSelesai / totalAll) * 100) : 0;

    setDashboardData({
      tugasTerbaru: tugas.slice(0, 3),
      aktivitasTerkini: aktivitas.slice(0, 3),
      progress: progressData,
      stats: {
        totalSelesai,
        belumSelesai: totalBelum,
        progressTotal
      }
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '2 jam yang lalu';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam yang lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari yang lalu`;
  };

  const dataSiswa = {
    nama: user?.name || 'Putra Wibawa',
    kelas: 'X RPL 2',
    absen: '12'
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
            <div className="header-brand">
              <div className="logo-icon icon-chart"></div>
              <h1 className="header-title"> Dashboard Siswa</h1>
            </div>
          </div>
          <div className="header-right">
            <NotificationDropdown userEmail={user?.email || 'guest'} />
            <span className="user-name">{dataSiswa.nama}</span>
          </div>
        </div>

        <div className="dashboard-content-new">
          {/* Top Section */}
          <div className="dashboard-top-section">
            {/* Data Diri */}
            <div className="data-diri-card">
              <h3>Data Diri</h3>
              <div className="profile-section">
                <div className="profile-avatar">
                  <div className="avatar-icon icon-user"></div>
                  <div className="profile-badge">60%</div>
                </div>
                <div className="profile-info">
                  <h4>{dataSiswa.nama}</h4>
                  <p className="profile-meta">{dataSiswa.kelas} | No. Absen {dataSiswa.absen}</p>
                </div>
              </div>
              <div className="prestasi-section">
                <div className="prestasi-icon icon-trophy"></div>
                <span className="prestasi-count">5 Penghargaan</span>
              </div>
            </div>

            {/* Aktivitas Terkini */}
            <div className="aktivitas-card">
              <div className="card-header">
                <h3>Aktivitas Terkini</h3>
                <button className="link-button" onClick={() => navigate('/siswa/nilai')}>
                  Lihat Semua
                </button>
              </div>
              <div className="aktivitas-list">
                {dashboardData.aktivitasTerkini.length > 0 ? (
                  dashboardData.aktivitasTerkini.map((item, index) => (
                    <div key={index} className="aktivitas-item">
                      <div className={`aktivitas-icon icon-${item.icon}`}></div>
                      <div className="aktivitas-content">
                        <p className="aktivitas-title">{item.judul}</p>
                        <span className="aktivitas-time">{item.waktu}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Belum ada aktivitas</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Pembelajaran */}
          <div className="progress-pembelajaran-card">
            <h3><span className="icon-chart inline-icon"></span> Progres Pembelajaran Keseluruhan</h3>
            <p className="progress-subtitle">Semester 1 - Tahun Ajaran 2024/2025</p>
            <div className="progress-header-text">Total Penyelesaian</div>
            <div className="progress-percentage">{dashboardData.stats.progressTotal}%</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${dashboardData.stats.progressTotal}%` }}></div>
            </div>
            
            <div className="progress-metrics">
              <div className="metric-item">
                <div className="metric-icon icon-book"></div>
                <div className="metric-content">
                  <p className="metric-value">{dashboardData.progress.materi}%</p>
                  <p className="metric-label">Materi</p>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-icon icon-check"></div>
                <div className="metric-content">
                  <p className="metric-value">{dashboardData.progress.kuis}%</p>
                  <p className="metric-label">Kuis</p>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-icon icon-trophy"></div>
                <div className="metric-content">
                  <p className="metric-value">{dashboardData.progress.project}%</p>
                  <p className="metric-label">Project</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="dashboard-bottom-section">
            {/* Tugas Terbaru */}
            <div className="tugas-terbaru-section">
              <div className="section-header">
                <h3>Tugas Terbaru Anda</h3>
                <button className="link-button" onClick={() => navigate('/siswa/kuis')}>
                  Lihat Semua
                </button>
              </div>
              <div className="tugas-list">
                {dashboardData.tugasTerbaru.length > 0 ? (
                  dashboardData.tugasTerbaru.map((tugas, index) => (
                    <div key={index} className="tugas-card" style={{ backgroundColor: tugas.bgColor }}>
                      <div className="tugas-icon-wrapper">
                        <div className={`tugas-icon icon-${tugas.icon}`}></div>
                      </div>
                      <div className="tugas-content">
                        <h4>{tugas.judul}</h4>
                        {tugas.status === 'Selesai' && tugas.nilai && (
                          <div className="tugas-meta">
                            <span className="badge-status orange"><span className="icon-clock inline-icon-sm"></span> Selesai</span>
                            <span className="tugas-deadline">Dikumpulkan: {tugas.deadline}</span>
                          </div>
                        )}
                        {tugas.status === 'Belum Selesai' && (
                          <div className="tugas-meta">
                            <span className="badge-status green"><span className="icon-check inline-icon-sm"></span> Belum Selesai</span>
                            <span className="tugas-deadline">Deadline: {tugas.deadline}</span>
                          </div>
                        )}
                        {tugas.status === 'Dalam Progress' && (
                          <div className="tugas-meta">
                            <span className="badge-status blue"><span className="icon-book inline-icon-sm"></span> Dalam Progress</span>
                            <span className="tugas-progress-text">{tugas.progress}% Selesai</span>
                          </div>
                        )}
                      </div>
                      {tugas.nilai && (
                        <div className="tugas-nilai">
                          <span className="nilai-badge">{tugas.nilai}</span>
                          <span className="nilai-label">Nilai</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Tidak ada tugas terbaru</p>
                )}
              </div>
            </div>

            {/* Grafik Pembelajaran */}
            <div className="grafik-section">
              <h3>Grafik Pembelajaran</h3>
              <div className="grafik-list">
                <div className="grafik-item">
                  <div className="grafik-header">
                    <div className="grafik-icon-label">
                      <span className="grafik-icon icon-book"></span>
                      <span className="grafik-label">Materi</span>
                    </div>
                    <span className="grafik-score">{Math.round(dashboardData.progress.materi / 10) || 6}/10</span>
                  </div>
                  <div className="grafik-bar-container">
                    <div className="grafik-bar" style={{ width: `${dashboardData.progress.materi}%`, backgroundColor: '#C9A961' }}></div>
                    <div className="grafik-bar-bg" style={{ width: `${100 - dashboardData.progress.materi}%`, backgroundColor: '#E0E0E0' }}></div>
                  </div>
                  <span className="grafik-percent">{dashboardData.progress.materi}% selesai</span>
                </div>

                <div className="grafik-item">
                  <div className="grafik-header">
                    <div className="grafik-icon-label">
                      <span className="grafik-icon icon-check"></span>
                      <span className="grafik-label">Kuis</span>
                    </div>
                    <span className="grafik-score">{Math.round(dashboardData.progress.kuis / 10) || 6}/10</span>
                  </div>
                  <div className="grafik-bar-container">
                    <div className="grafik-bar" style={{ width: `${dashboardData.progress.kuis}%`, backgroundColor: '#C9A961' }}></div>
                    <div className="grafik-bar-bg" style={{ width: `${100 - dashboardData.progress.kuis}%`, backgroundColor: '#E0E0E0' }}></div>
                  </div>
                  <span className="grafik-percent">{dashboardData.progress.kuis}% selesai</span>
                </div>

                <div className="grafik-item">
                  <div className="grafik-header">
                    <div className="grafik-icon-label">
                      <span className="grafik-icon icon-trophy"></span>
                      <span className="grafik-label">Project</span>
                    </div>
                    <span className="grafik-score">{Math.round(dashboardData.progress.project / 10) || 8}/12</span>
                  </div>
                  <div className="grafik-bar-container">
                    <div className="grafik-bar" style={{ width: `${dashboardData.progress.project}%`, backgroundColor: '#C9A961' }}></div>
                    <div className="grafik-bar-bg" style={{ width: `${100 - dashboardData.progress.project}%`, backgroundColor: '#E0E0E0' }}></div>
                  </div>
                  <span className="grafik-percent">{Math.round(dashboardData.progress.project)}% selesai</span>
                </div>
              </div>

              {/* Statistik */}
              <div className="statistik-section">
                <div className="stat-item">
                  <p className="stat-value">{dashboardData.stats.totalSelesai || 20}</p>
                  <p className="stat-label">Total Selesai</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value gray">{dashboardData.stats.belumSelesai || 12}</p>
                  <p className="stat-label">Belum Selesai</p>
                </div>
                <div className="stat-item">
                  <p className="stat-value gold">{dashboardData.stats.progressTotal}%</p>
                  <p className="stat-label">Progres Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiswaDashboard;
