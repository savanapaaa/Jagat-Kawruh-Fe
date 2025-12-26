import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { getSiswaList, addSiswa, updateSiswa, deleteSiswa } from '../../../services/dataService';
import '../../../styles/icons.css';
import './DataSiswa.css';

function DataSiswa() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  
  const [formData, setFormData] = useState({
    nama: '',
    nis: '',
    email: '',
    password: '',
    kelas: '',
    jenisKelamin: 'L',
    angkatan: new Date().getFullYear().toString()
  });

  useEffect(() => {
    loadSiswaData();
  }, []);

  const loadSiswaData = () => {
    const data = getSiswaList();
    setSiswaList(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (siswa = null) => {
    if (siswa) {
      setEditMode(true);
      setSelectedSiswa(siswa);
      setFormData({
        nama: siswa.nama,
        nis: siswa.nis,
        email: siswa.email,
        password: '',
        kelas: siswa.kelas,
        jenisKelamin: siswa.jenisKelamin,
        angkatan: siswa.angkatan
      });
    } else {
      setEditMode(false);
      setSelectedSiswa(null);
      setFormData({
        nama: '',
        nis: '',
        email: '',
        password: '',
        kelas: '',
        jenisKelamin: 'L',
        angkatan: new Date().getFullYear().toString()
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedSiswa(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await updateSiswa(selectedSiswa.id, formData);
        alert('✅ Data siswa berhasil diperbarui!');
      } else {
        await addSiswa(formData);
        alert('✅ Siswa berhasil ditambahkan!');
      }
      
      loadSiswaData();
      handleCloseModal();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = (siswa) => {
    if (window.confirm(`Yakin ingin menghapus siswa ${siswa.nama}?`)) {
      try {
        deleteSiswa(siswa.id);
        alert('✅ Siswa berhasil dihapus!');
        loadSiswaData();
      } catch (error) {
        alert(`❌ Error: ${error.message}`);
      }
    }
  };

  const filteredSiswa = siswaList.filter(siswa => {
    const matchSearch = siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       siswa.nis.includes(searchTerm) ||
                       siswa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKelas = !filterKelas || siswa.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const kelasList = [...new Set(siswaList.map(s => s.kelas))].sort();

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
          <div className="header-right">
            <button className="btn-primary" onClick={() => handleOpenModal()}>
              <span className="icon-plus small-icon"></span>
              Tambah Siswa
            </button>
          </div>
        </div>

        <div className="dashboard-content-area">
          {/* Filters */}
          <div className="filters-row">
            <button className="btn-primary mobile-add-btn" onClick={() => handleOpenModal()}>
              <span className="icon-plus small-icon"></span>
              Tambah Siswa
            </button>
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
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="">Semua Kelas</option>
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
                <p className="stat-label">Total Siswa</p>
                <h3 className="stat-value">{siswaList.length}</h3>
              </div>
            </div>
            <div className="stat-item">
              <span className="icon-folder stat-icon"></span>
              <div>
                <p className="stat-label">Total Kelas</p>
                <h3 className="stat-value">{kelasList.length}</h3>
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
                  <th>Kelas</th>
                  <th>JK</th>
                  <th>Angkatan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="empty-icon icon-user"></div>
                      <p>Belum ada data siswa</p>
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa, index) => (
                    <tr key={siswa.id}>
                      <td>{index + 1}</td>
                      <td>{siswa.nis}</td>
                      <td>{siswa.nama}</td>
                      <td>{siswa.email}</td>
                      <td><span className="badge-kelas">{siswa.kelas}</span></td>
                      <td>{siswa.jenisKelamin}</td>
                      <td>{siswa.angkatan}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleOpenModal(siswa)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(siswa)}
                            title="Hapus"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>NIS *</label>
                  <input
                    type="text"
                    name="nis"
                    value={formData.nis}
                    onChange={handleInputChange}
                    required
                    disabled={editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password {!editMode && '*'}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editMode}
                    placeholder={editMode ? 'Kosongkan jika tidak diubah' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Kelas *</label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    placeholder="Contoh: X RPL 1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Jenis Kelamin *</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Angkatan *</label>
                  <input
                    type="text"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataSiswa;
