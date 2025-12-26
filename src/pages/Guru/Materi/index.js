import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { getMateriList, addMateri, updateMateri, deleteMateri } from '../../../services/dataService';
import '../../../styles/icons.css';
import './Materi.css';

function KelolaMateri() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materiList, setMateriList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingMateri, setEditingMateri] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    kelas: '',
    deskripsi: '',
    file: null,
  });

  // Load data dari localStorage saat component mount
  useEffect(() => {
    setMateriList(getMateriList());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      if (editingMateri) {
        // Update materi
        const updated = updateMateri(editingMateri.id, {
          ...formData,
          file: formData.file?.name || editingMateri.file
        });
        setMateriList(getMateriList());
      } else {
        // Tambah materi baru
        const newMateri = {
          ...formData,
          file: formData.file?.name || 'file.pdf',
        };
        addMateri(newMateri);
        setMateriList(getMateriList());
      }
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan materi: ' + error.message);
    }
  };

  const handleEdit = (materi) => {
    setEditingMateri(materi);
    setFormData({
      judul: materi.judul,
      kelas: materi.kelas,
      deskripsi: materi.deskripsi,
      file: null,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus materi ini?')) {
      try {
        deleteMateri(id);
        setMateriList(getMateriList());
      } catch (error) {
        alert('Gagal menghapus materi: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ judul: '', kelas: '', deskripsi: '', file: null });
    setEditingMateri(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="kelola-materi">
        <div className="kelola-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Kelola Materi</h1>
              <p className="header-subtitle">Kelola dan tambahkan materi pembelajaran</p>
            </div>
          </div>
          <button 
            className="btn-tambah"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Batal' : '➕ Tambah Materi'}
          </button>
        </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingMateri ? 'Edit Materi' : 'Tambah Materi Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Materi *</label>
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

            <div className="form-group">
              <label>Deskripsi *</label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Upload File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              />
              <small>Format: PDF, DOC, DOCX, PPT, PPTX</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingMateri ? 'Update' : 'Simpan'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {materiList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon icon-book"></div>
          <h3>Belum ada materi</h3>
          <p>Klik "Tambah Materi" untuk memulai mengelola materi pembelajaran</p>
        </div>
      ) : (
        <div className="materi-grid">
          {materiList.map((materi) => (
            <div key={materi.id} className="materi-card">
              <div className="materi-thumbnail">
                <div className="icon-book"></div>
              </div>
              <div className="materi-content">
                <h3 className="materi-judul">{materi.judul}</h3>
                <span className="materi-kelas">{materi.kelas}</span>
                <p className="materi-deskripsi">{materi.deskripsi}</p>
                <div className="materi-file">
                  <span className="icon-folder inline-icon-sm"></span> {materi.file}
                </div>
                <div className="materi-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(materi)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(materi.id)}
                  >
                    Hapus
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

export default KelolaMateri;
