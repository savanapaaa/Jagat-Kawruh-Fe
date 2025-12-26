import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import { getKuisById, getSoalByKuisId, addSoal, updateSoal, deleteSoal } from '../../../services/dataService';
import '../../../styles/icons.css';
import './KelolaSoal.css';

function KelolaSoal() {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kuis, setKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSoal, setEditingSoal] = useState(null);
  const [formData, setFormData] = useState({
    tipe: 'pilihan_ganda',
    pertanyaan: '',
    opsi: ['', '', '', ''],
    jawabanBenar: 0,
    poin: 10,
  });

  // Load data kuis dan soal
  useEffect(() => {
    const kuisData = getKuisById(kuisId);
    if (!kuisData) {
      alert('Kuis tidak ditemukan!');
      navigate('/guru/kuis');
      return;
    }
    setKuis(kuisData);
    setSoalList(getSoalByKuisId(kuisId));
  }, [kuisId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (formData.tipe === 'pilihan_ganda') {
      const allOptionsFilled = formData.opsi.every(o => o.trim() !== '');
      if (!allOptionsFilled) {
        alert('Semua opsi jawaban harus diisi!');
        return;
      }
    }

    try {
      if (editingSoal) {
        // Update soal
        updateSoal(editingSoal.id, {
          ...formData,
          kuisId: parseInt(kuisId)
        });
        setSoalList(getSoalByKuisId(kuisId));
      } else {
        // Tambah soal baru
        addSoal({
          ...formData,
          kuisId: parseInt(kuisId)
        });
        setSoalList(getSoalByKuisId(kuisId));
      }
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan soal: ' + error.message);
    }
  };

  const handleEdit = (soal) => {
    setEditingSoal(soal);
    setFormData({
      tipe: soal.tipe,
      pertanyaan: soal.pertanyaan,
      opsi: soal.opsi || ['', '', '', ''],
      jawabanBenar: soal.jawabanBenar,
      poin: soal.poin,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus soal ini?')) {
      try {
        deleteSoal(id);
        setSoalList(getSoalByKuisId(kuisId));
      } catch (error) {
        alert('Gagal menghapus soal: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tipe: 'pilihan_ganda',
      pertanyaan: '',
      opsi: ['', '', '', ''],
      jawabanBenar: 0,
      poin: 10,
    });
    setEditingSoal(null);
    setShowForm(false);
  };

  const handleOpsiChange = (index, value) => {
    const newOpsi = [...formData.opsi];
    newOpsi[index] = value;
    setFormData({ ...formData, opsi: newOpsi });
  };

  const totalPoin = soalList.reduce((sum, soal) => sum + Number(soal.poin), 0);
  const soalPilihanGanda = soalList.filter(s => s.tipe === 'pilihan_ganda').length;
  const soalEssay = soalList.filter(s => s.tipe === 'essay').length;

  return (
    <div className="dashboard-container">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="kelola-soal">
        <div className="kelola-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Kelola Soal Kuis</h1>
              <p className="header-subtitle">{kuis?.judul || 'Loading...'} - {kuis?.kelas}</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/guru/kuis" className="btn-back">
              ← Kembali
            </Link>
            <button 
              className="btn-tambah"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '❌ Batal' : '➕ Tambah Soal'}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon icon-quiz"></div>
            <div className="summary-content">
              <h3>{soalList.length}</h3>
              <p>Total Soal</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-trophy"></div>
            <div className="summary-content">
              <h3>{totalPoin}</h3>
              <p>Total Poin</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-check"></div>
            <div className="summary-content">
              <h3>{soalPilihanGanda}</h3>
              <p>Pilihan Ganda</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon icon-quiz"></div>
            <div className="summary-content">
              <h3>{soalEssay}</h3>
              <p>Essay</p>
            </div>
          </div>
        </div>

        {/* Form Tambah/Edit Soal */}
        {showForm && (
          <div className="form-container">
            <h3>{editingSoal ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipe Soal *</label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      tipe: e.target.value,
                      opsi: e.target.value === 'pilihan_ganda' ? ['', '', '', ''] : [],
                      jawabanBenar: e.target.value === 'pilihan_ganda' ? 0 : ''
                    })}
                    required
                  >
                    <option value="pilihan_ganda">Pilihan Ganda</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Poin *</label>
                  <input
                    type="number"
                    value={formData.poin}
                    onChange={(e) => setFormData({ ...formData, poin: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pertanyaan *</label>
                <textarea
                  value={formData.pertanyaan}
                  onChange={(e) => setFormData({ ...formData, pertanyaan: e.target.value })}
                  rows="4"
                  placeholder="Tulis pertanyaan soal di sini..."
                  required
                />
              </div>

              {formData.tipe === 'pilihan_ganda' ? (
                <>
                  <div className="opsi-container">
                    <label>Opsi Jawaban *</label>
                    {['A', 'B', 'C', 'D'].map((label, index) => (
                      <div key={index} className="opsi-input-group">
                        <span className="opsi-label">{label}.</span>
                        <input
                          type="text"
                          value={formData.opsi[index]}
                          onChange={(e) => handleOpsiChange(index, e.target.value)}
                          placeholder={`Opsi ${label}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Jawaban Benar *</label>
                    <select
                      value={formData.jawabanBenar}
                      onChange={(e) => setFormData({ ...formData, jawabanBenar: parseInt(e.target.value) })}
                      required
                    >
                      <option value={0}>A. {formData.opsi[0] || '(Kosong)'}</option>
                      <option value={1}>B. {formData.opsi[1] || '(Kosong)'}</option>
                      <option value={2}>C. {formData.opsi[2] || '(Kosong)'}</option>
                      <option value={3}>D. {formData.opsi[3] || '(Kosong)'}</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Kata Kunci Jawaban</label>
                  <input
                    type="text"
                    value={formData.jawabanBenar}
                    onChange={(e) => setFormData({ ...formData, jawabanBenar: e.target.value })}
                    placeholder="Pisahkan dengan koma, contoh: useState, useEffect, useContext"
                  />
                  <small>Kata kunci ini untuk membantu penilaian manual</small>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingSoal ? 'Update Soal' : 'Simpan Soal'}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Soal */}
        {soalList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon icon-quiz"></div>
            <h3>Belum ada soal</h3>
            <p>Klik "Tambah Soal" untuk mulai membuat soal kuis</p>
          </div>
        ) : (
          <div className="soal-list">
            {soalList.map((soal, index) => (
              <div key={soal.id} className="soal-card">
                <div className="soal-header">
                  <div className="soal-number">Soal #{index + 1}</div>
                  <div className="soal-meta">
                    <span className={`badge-tipe ${soal.tipe}`}>
                      {soal.tipe === 'pilihan_ganda' ? 'Pilihan Ganda' : 'Essay'}
                    </span>
                    <span className="badge-poin">{soal.poin} poin</span>
                  </div>
                </div>

                <div className="soal-content">
                  <p className="soal-pertanyaan">{soal.pertanyaan}</p>

                  {soal.tipe === 'pilihan_ganda' && (
                    <div className="soal-opsi">
                      {soal.opsi.map((opsi, idx) => (
                        <div 
                          key={idx} 
                          className={`opsi-item ${idx === soal.jawabanBenar ? 'correct' : ''}`}
                        >
                          <span className="opsi-label">{['A', 'B', 'C', 'D'][idx]}.</span>
                          <span className="opsi-text">{opsi}</span>
                          {idx === soal.jawabanBenar && <span className="correct-badge">✓ Benar</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {soal.tipe === 'essay' && (
                    <div className="essay-answer">
                      <strong>Kata Kunci Jawaban:</strong>
                      <p>{soal.jawabanBenar || 'Tidak ada kata kunci'}</p>
                    </div>
                  )}
                </div>

                <div className="soal-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(soal)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(soal.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KelolaSoal;
