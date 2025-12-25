import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import { getKuisList, addKuis, updateKuis, deleteKuis } from '../../../services/dataService';
import './Kuis.css';

function KelolaKuis() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kuisList, setKuisList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingKuis, setEditingKuis] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    kelas: '',
    durasi: '',
    jumlahSoal: '',
    status: 'Aktif',
  });

  // Load data dari localStorage saat component mount
  useEffect(() => {
    setKuisList(getKuisList());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      if (editingKuis) {
        // Update kuis
        updateKuis(editingKuis.id, formData);
        setKuisList(getKuisList());
      } else {
        // Tambah kuis baru
        addKuis(formData);
        setKuisList(getKuisList());
      }
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan kuis: ' + error.message);
    }
  };

  const handleEdit = (kuis) => {
    setEditingKuis(kuis);
    setFormData({
      judul: kuis.judul,
      kelas: kuis.kelas,
      durasi: kuis.durasi,
      jumlahSoal: kuis.jumlahSoal,
      status: kuis.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus kuis ini?')) {
      try {
        deleteKuis(id);
        setKuisList(getKuisList());
      } catch (error) {
        alert('Gagal menghapus kuis: ' + error.message);
      }
    }
  };

  const toggleStatus = (id) => {
    try {
      const kuis = kuisList.find(k => k.id === id);
      if (kuis) {
        updateKuis(id, { 
          status: kuis.status === 'Aktif' ? 'Nonaktif' : 'Aktif' 
        });
        setKuisList(getKuisList());
      }
    } catch (error) {
      alert('Gagal mengubah status: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ 
      judul: '', 
      kelas: '', 
      durasi: '', 
      jumlahSoal: '', 
      status: 'Aktif' 
    });
    setEditingKuis(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="kelola-kuis">
        <div className="kelola-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Kelola Kuis</h1>
              <p className="header-subtitle">Kelola dan buat kuis untuk siswa</p>
            </div>
          </div>
          <button 
            className="btn-tambah"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Batal' : '➕ Tambah Kuis'}
          </button>
        </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingKuis ? 'Edit Kuis' : 'Tambah Kuis Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Judul Kuis *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kelas *</label>
                <select
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X RPL">X RPL</option>
                  <option value="XI RPL">XI RPL</option>
                  <option value="XII RPL">XII RPL</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Durasi (menit) *</label>
                <input
                  type="number"
                  value={formData.durasi}
                  onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Jumlah Soal *</label>
                <input
                  type="number"
                  value={formData.jumlahSoal}
                  onChange={(e) => setFormData({ ...formData, jumlahSoal: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingKuis ? '💾 Update' : '✅ Simpan'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {kuisList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>Belum ada kuis</h3>
          <p>Klik "Tambah Kuis" untuk memulai membuat kuis untuk siswa</p>
        </div>
      ) : (
        <div className="kuis-grid">
          {kuisList.map((kuis) => (
            <div key={kuis.id} className="kuis-card">
              <div className="kuis-header">
                <div className="kuis-icon">📝</div>
                <span className={`status-badge ${kuis.status.toLowerCase()}`}>
                  {kuis.status}
                </span>
              </div>
              <div className="kuis-content">
                <h3 className="kuis-judul">{kuis.judul}</h3>
                <span className="kuis-kelas">{kuis.kelas}</span>
                <div className="kuis-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span className="meta-text">{kuis.durasi} menit</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📋</span>
                    <span className="meta-text">{kuis.jumlahSoal} soal</span>
                  </div>
                </div>
                <div className="kuis-actions">
                  <button 
                    className="btn-soal"
                    onClick={() => navigate(`/guru/kuis/${kuis.id}/soal`)}
                  >
                    📝 Soal
                  </button>
                  <button 
                    className="btn-toggle"
                    onClick={() => toggleStatus(kuis.id)}
                  >
                    {kuis.status === 'Aktif' ? '⏸️' : '▶️'}
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(kuis)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(kuis.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default KelolaKuis;
