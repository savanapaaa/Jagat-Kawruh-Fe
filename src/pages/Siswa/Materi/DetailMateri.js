import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getMateriList, markMateriAsCompleted, markMateriAsStarted } from '../../../services/dataService';
import Sidebar from '../../../components/Sidebar';
import './DetailMateri.css';

function DetailMateri() {
  const { materiId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materi, setMateri] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const materiList = getMateriList();
    const foundMateri = materiList.find(m => m.id === parseInt(materiId));
    if (foundMateri) {
      setMateri(foundMateri);
      // Mark as started when page loads
      markMateriAsStarted(user?.email || 'guest', foundMateri.id);
      setHasStarted(true);
    } else {
      navigate('/siswa/materi');
    }
  }, [materiId, navigate, user]);

  const handleDownload = () => {
    // Mark as completed when downloaded
    if (materi) {
      markMateriAsCompleted(user?.email || 'guest', materi.id);
      alert(`File "${materi.file}" berhasil didownload!\n\nMateri telah ditandai sebagai selesai.`);
    }
  };

  const handleMarkComplete = () => {
    if (materi) {
      markMateriAsCompleted(user?.email || 'guest', materi.id);
      alert('Materi telah ditandai sebagai selesai! 🎉');
      setTimeout(() => navigate('/siswa/materi'), 1000);
    }
  };

  if (!materi) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="siswa" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="detail-materi-page">
        <div className="detail-materi-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <button className="btn-back" onClick={() => navigate('/siswa/materi')}>
              ← Kembali
            </button>
          </div>
        </div>

        <div className="detail-materi-content">
          <div className="materi-hero">
            <div className="materi-hero-icon">📚</div>
            <h1 className="materi-title">{materi.judul}</h1>
            <div className="materi-meta-info">
              <span className="meta-item">📖 {materi.kelas}</span>
              <span className="meta-item">👨‍🏫 Guru Pengampu</span>
            </div>
          </div>

          <div className="materi-body">
            <div className="materi-section">
              <h2 className="section-title">📝 Deskripsi Materi</h2>
              <p className="section-content">{materi.deskripsi}</p>
            </div>

            {materi.file && (
              <div className="materi-section">
                <h2 className="section-title">📎 File Materi</h2>
                <div className="file-card">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <p className="file-name">{materi.file}</p>
                    <p className="file-size">File PDF</p>
                  </div>
                  <button className="btn-download" onClick={handleDownload}>
                    ⬇️ Download
                  </button>
                </div>
                <p className="download-note">💡 Download file untuk belajar. Status akan otomatis berubah menjadi "Selesai" setelah download.</p>
              </div>
            )}

            <div className="materi-section">
              <h2 className="section-title">🎯 Tujuan Pembelajaran</h2>
              <ul className="learning-objectives">
                <li>Memahami konsep dasar materi {materi.judul}</li>
                <li>Mampu mengaplikasikan teori dalam praktik</li>
                <li>Menyelesaikan latihan dan tugas terkait</li>
              </ul>
            </div>

            <div className="materi-actions">
              <button 
                className="btn-primary-action"
                onClick={handleMarkComplete}
              >
                ✅ Tandai Selesai
              </button>
              <button 
                className="btn-secondary-action"
                onClick={() => navigate('/siswa/materi')}
              >
                📋 Kembali ke Daftar Materi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailMateri;
