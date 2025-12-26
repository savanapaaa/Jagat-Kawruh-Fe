import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import { getSiswaByKelas, getKelasList } from '../../../services/dataService';
import '../../../styles/icons.css';
import './Siswa.css';

function Siswa() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [siswaList, setSiswaList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    const kelas = getKelasList();
    setKelasList(kelas);
    if (kelas.length > 0) {
      setSelectedKelas(kelas[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedKelas) {
      const siswa = getSiswaByKelas(selectedKelas);
      setSiswaList(siswa);
    }
  }, [selectedKelas]);

  const filteredSiswa = siswaList.filter(siswa => 
    siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nis.includes(searchTerm) ||
    siswa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
              <div className="logo-icon icon-user"></div>
              <h1 className="header-title">Data Siswa</h1>
            </div>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Filters */}
          <div className="filters-row">
            <div className="search-box">
              <span className="icon-user small-icon"></span>
              <input
                type="text"
                placeholder="Cari nama, NIS, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
            >
              {kelasList.map(kelas => (
                <option key={kelas} value={kelas}>{kelas}</option>
              ))}
            </select>
          </div>

          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-item">
              <span className="icon-user stat-icon"></span>
              <div>
                <p className="stat-label">Total Siswa di Kelas</p>
                <h3 className="stat-value">{siswaList.length}</h3>
              </div>
            </div>
            <div className="stat-item">
              <span className="icon-folder stat-icon"></span>
              <div>
                <p className="stat-label">Kelas yang Dipilih</p>
                <h3 className="stat-value">{selectedKelas || '-'}</h3>
              </div>
            </div>
          </div>

          {/* Daftar Siswa sebagai kartu */}
          {filteredSiswa.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon icon-user"></div>
              <p>{siswaList.length === 0 ? 'Belum ada siswa di kelas ini' : 'Tidak ada hasil pencarian'}</p>
            </div>
          ) : (
            <div className="siswa-grid">
              {filteredSiswa.map((siswa, index) => {
                const initials = siswa.nama
                  .split(' ')
                  .filter(Boolean)
                  .map(part => part[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div key={siswa.id} className="siswa-card">
                    <div className="siswa-card-top">
                      <div className="siswa-avatar">
                        <span>{initials}</span>
                      </div>
                      <div className="siswa-main-info">
                        <h4 className="siswa-name">{siswa.nama}</h4>
                        <p className="siswa-nis">NIS: {siswa.nis}</p>
                      </div>
                      <span className="badge-kelas">{selectedKelas || siswa.kelas}</span>
                    </div>

                    <div className="siswa-meta">
                      <div className="siswa-meta-item">
                        <span className="meta-label">Email</span>
                        <span className="meta-value">{siswa.email}</span>
                      </div>
                      <div className="siswa-meta-row">
                        <div className="siswa-meta-chip">
                          <span className="meta-label">JK</span>
                          <span className="meta-value">{siswa.jenisKelamin}</span>
                        </div>
                        <div className="siswa-meta-chip">
                          <span className="meta-label">Angkatan</span>
                          <span className="meta-value">{siswa.angkatan}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Siswa;
