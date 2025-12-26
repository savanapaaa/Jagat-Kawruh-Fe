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

          {/* Table */}
          <div className="table-container">
            <table className="siswa-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>JK</th>
                  <th>Angkatan</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-icon icon-user"></div>
                      <p>{siswaList.length === 0 ? 'Belum ada siswa di kelas ini' : 'Tidak ada hasil pencarian'}</p>
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa, index) => (
                    <tr key={siswa.id}>
                      <td>{index + 1}</td>
                      <td>{siswa.nis}</td>
                      <td>
                        <div className="student-name">
                          <span className="icon-user small-icon"></span>
                          {siswa.nama}
                        </div>
                      </td>
                      <td>{siswa.email}</td>
                      <td>{siswa.jenisKelamin}</td>
                      <td>{siswa.angkatan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Siswa;
