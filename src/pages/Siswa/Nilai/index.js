import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import '../../../styles/icons.css';
import './Nilai.css';

function Nilai() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('kuis');
  const [hasilKuis, setHasilKuis] = useState([]);
  const [nilaiPBL, setNilaiPBL] = useState([]);

  useEffect(() => {
    // Get hasil kuis
    const hasilKuisData = JSON.parse(localStorage.getItem('hasil_kuis') || '[]');
    const userHasil = hasilKuisData.filter(h => h.userId === user?.email);
    setHasilKuis(userHasil);

    // Get nilai PBL
    const nilaiPBLData = JSON.parse(localStorage.getItem('jagat_kawruh_nilai_pbl') || '[]');
    const userNilaiPBL = nilaiPBLData.filter(n => n.userId === user?.email);
    setNilaiPBL(userNilaiPBL);
  }, [user]);

  const getStatusBadge = (status) => {
    if (status === 'dinilai') {
      return <span className="status-badge status-dinilai">✓ Sudah Dinilai</span>;
    } else if (status === 'menunggu') {
      return <span className="status-badge status-menunggu">⏳ Menunggu Penilaian</span>;
    }
    return <span className="status-badge status-belum">○ Belum Dikerjakan</span>;
  };

  const calculateRataRata = () => {
    if (hasilKuis.length === 0) return 0;
    const total = hasilKuis.reduce((sum, h) => sum + (h.nilai || 0), 0);
    return (total / hasilKuis.length).toFixed(2);
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
            <div className="header-brand">
              <div className="logo-icon icon-trophy"></div>
              <h1 className="header-title">Nilai</h1>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <span className="user-name">{user?.name || 'Siswa'}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon icon-quiz"></div>
              <div className="summary-info">
                <h3>Total Kuis</h3>
                <p className="summary-value">{hasilKuis.length}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon icon-chart"></div>
              <div className="summary-info">
                <h3>Rata-rata Kuis</h3>
                <p className="summary-value">{calculateRataRata()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon icon-target"></div>
              <div className="summary-info">
                <h3>PBL Selesai</h3>
                <p className="summary-value">{nilaiPBL.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="nilai-tabs">
            <button 
              className={`tab-btn ${activeTab === 'kuis' ? 'active' : ''}`}
              onClick={() => setActiveTab('kuis')}
            >
              <span className="icon-quiz inline-icon-sm"></span> Nilai Kuis
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pbl' ? 'active' : ''}`}
              onClick={() => setActiveTab('pbl')}
            >
              <span className="icon-target inline-icon-sm"></span> Nilai PBL
            </button>
          </div>

          {/* Content */}
          {activeTab === 'kuis' && (
            <div className="nilai-content">
              {hasilKuis.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon icon-quiz"></div>
                  <h3>Belum ada hasil kuis</h3>
                  <p>Kerjakan kuis untuk melihat nilai Anda</p>
                </div>
              ) : (
                <div className="nilai-table-container">
                  <table className="nilai-table">
                    <thead>
                      <tr>
                        <th>Judul Kuis</th>
                        <th>Tanggal</th>
                        <th>Benar/Total</th>
                        <th>Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hasilKuis.map((hasil, index) => (
                        <tr key={index}>
                          <td>{hasil.judulKuis}</td>
                          <td>{new Date(hasil.tanggal).toLocaleDateString('id-ID')}</td>
                          <td>{hasil.benar}/{hasil.totalSoal}</td>
                          <td>
                            <span className={`nilai-badge ${hasil.nilai >= 75 ? 'nilai-tinggi' : hasil.nilai >= 60 ? 'nilai-sedang' : 'nilai-rendah'}`}>
                              {hasil.nilai}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pbl' && (
            <div className="nilai-content">
              {nilaiPBL.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon icon-target"></div>
                  <h3>Belum ada nilai PBL</h3>
                  <p>Selesaikan project PBL untuk mendapatkan nilai</p>
                </div>
              ) : (
                <div className="nilai-grid">
                  {nilaiPBL.map((nilai, index) => (
                    <div key={index} className="nilai-pbl-card">
                      <div className="card-header">
                        <h3>{nilai.judulPBL}</h3>
                        <span className={`nilai-badge ${nilai.nilai >= 75 ? 'nilai-tinggi' : nilai.nilai >= 60 ? 'nilai-sedang' : 'nilai-rendah'}`}>
                          {nilai.nilai}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="info-row">
                          <span className="label">Tanggal Dinilai:</span>
                          <span>{new Date(nilai.tanggalDinilai).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Feedback:</span>
                        </div>
                        <div className="feedback-box">
                          {nilai.feedback || 'Tidak ada feedback'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nilai;
