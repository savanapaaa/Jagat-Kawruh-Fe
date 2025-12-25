import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import { getPBLList, addPBL, updatePBL, deletePBL } from '../../../services/dataService';
import './PBL.css';

function KelolaPBL() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pblList, setPblList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPBL, setEditingPBL] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    kelas: '',
    deadline: '',
    deskripsi: '',
    status: 'Aktif',
  });

  useEffect(() => {
    setPblList(getPBLList());
  }, []);

  const defaultSintaks = [
    {
      nomor: 1,
      judul: 'Mengorientasikan siswa terhadap masalah',
      tahap: [
        { nomor: 1, judul: 'Orientasi Masalah', instruksi: '' },
        { nomor: 2, judul: 'Identifikasi Masalah', instruksi: '' },
      ]
    },
    {
      nomor: 2,
      judul: 'Mengorganisasi siswa untuk belajar',
      tahap: [
        { nomor: 1, judul: 'Pembentukan Kelompok', instruksi: '' },
        { nomor: 2, judul: 'Pembagian Tugas', instruksi: '' },
      ]
    },
    {
      nomor: 3,
      judul: 'Membimbing penyelidikan individual maupun kelompok',
      tahap: [
        { nomor: 1, judul: 'Riset dan Pengumpulan Data', instruksi: '' },
        { nomor: 2, judul: 'Analisis Data', instruksi: '' },
      ]
    },
    {
      nomor: 4,
      judul: 'Mengembangkan dan menyajikan hasil',
      tahap: [
        { nomor: 1, judul: 'Penyusunan Laporan', instruksi: '' },
        { nomor: 2, judul: 'Persiapan Presentasi', instruksi: '' },
      ]
    },
    {
      nomor: 5,
      judul: 'Menganalisis dan mengevaluasi proses pemecahan masalah',
      tahap: [
        { nomor: 1, judul: 'Refleksi', instruksi: '' },
        { nomor: 2, judul: 'Evaluasi Hasil', instruksi: '' },
      ]
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const pblData = {
        ...formData,
        sintaks: defaultSintaks
      };

      if (editingPBL) {
        updatePBL(editingPBL.id, pblData);
      } else {
        addPBL(pblData);
      }
      setPblList(getPBLList());
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan PBL: ' + error.message);
    }
  };

  const handleEdit = (pbl) => {
    setEditingPBL(pbl);
    setFormData({
      judul: pbl.judul,
      kelas: pbl.kelas,
      deadline: pbl.deadline,
      deskripsi: pbl.deskripsi,
      status: pbl.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus PBL ini?')) {
      try {
        deletePBL(id);
        setPblList(getPBLList());
      } catch (error) {
        alert('Gagal menghapus PBL: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ judul: '', kelas: '', deadline: '', deskripsi: '', status: 'Aktif' });
    setEditingPBL(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="kelola-pbl">
        <div className="kelola-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Kelola Problem Based Learning</h1>
              <p className="header-subtitle">Buat dan kelola project PBL dengan 5 sintaks</p>
            </div>
          </div>
          <button 
            className="btn-tambah"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Batal' : '➕ Tambah PBL Project'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h3>{editingPBL ? 'Edit PBL Project' : 'Tambah PBL Project Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Judul Project *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Kelompok Java Script"
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

              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi Project *</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows="4"
                  placeholder="Jelaskan konteks dan tujuan project PBL ini..."
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
                  <option value="Draft">Draft</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="info-box">
                <p>ℹ️ <strong>Info:</strong> PBL Project akan otomatis memiliki 5 sintaks sesuai metode Problem Based Learning. Anda bisa customize tahapan di setiap sintaks setelah project dibuat.</p>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingPBL ? 'Update Project' : 'Buat Project'}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="pbl-grid">
          {pblList.map(pbl => (
            <div key={pbl.id} className="pbl-card">
              <div className="pbl-header">
                <div className="pbl-icon">🎯</div>
                <span className={`status-badge ${pbl.status.toLowerCase()}`}>
                  {pbl.status}
                </span>
              </div>
              
              <h3 className="pbl-title">{pbl.judul}</h3>
              
              <div className="pbl-meta">
                <div className="meta-item">
                  <span className="meta-label">Kelas:</span>
                  <span className="meta-value">{pbl.kelas}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Deadline:</span>
                  <span className="meta-value">{new Date(pbl.deadline).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Sintaks:</span>
                  <span className="meta-value">5 Fase PBL</span>
                </div>
              </div>

              <p className="pbl-desc">{pbl.deskripsi}</p>

              <div className="pbl-actions">
                <button className="btn-detail" onClick={() => navigate(`/guru/pbl/${pbl.id}/detail`)}>
                  📋 Detail & Tahapan
                </button>
                <button className="btn-edit" onClick={() => handleEdit(pbl)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(pbl.id)}>
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}

          {pblList.length === 0 && !showForm && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Belum Ada PBL Project</h3>
              <p>Klik tombol "Tambah PBL Project" untuk membuat project Problem Based Learning pertama Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KelolaPBL;
