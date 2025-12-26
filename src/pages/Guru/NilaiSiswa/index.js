import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { getKuisList, getPBLList } from '../../../services/dataService';
import '../../../styles/icons.css';
import './NilaiSiswa.css';

function NilaiSiswa() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasilKuis, setHasilKuis] = useState([]);
  const [nilaiPBL, setNilaiPBL] = useState([]);
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [selectedPBL, setSelectedPBL] = useState(null);
  const [kuisList, setKuisList] = useState([]);
  const [pblList, setPblList] = useState([]);
  const [pblProgress, setPblProgress] = useState({});

  useEffect(() => {
    // Load data
    const hasilKuisData = JSON.parse(localStorage.getItem('hasil_kuis') || '[]');
    const nilaiPBLData = JSON.parse(localStorage.getItem('jagat_kawruh_nilai_pbl') || '[]');
    const pblProgressData = JSON.parse(localStorage.getItem('jagat_kawruh_pbl_progress') || '{}');
    
    setHasilKuis(hasilKuisData);
    setNilaiPBL(nilaiPBLData);
    setKuisList(getKuisList());
    setPblList(getPBLList());
    setPblProgress(pblProgressData);
  }, []);

  // Get unique students from hasil kuis and PBL
  const getAllStudents = () => {
    const students = new Set();
    hasilKuis.forEach(h => students.add(h.userId));
    Object.keys(pblProgress).forEach(userId => students.add(userId));
    return Array.from(students);
  };

  const getStudentData = (userId) => {
    const kuisData = hasilKuis.filter(h => h.userId === userId);
    const pblData = Object.entries(pblProgress).filter(([user]) => user === userId);
    
    const totalKuis = kuisData.length;
    const rataKuis = totalKuis > 0 
      ? (kuisData.reduce((sum, h) => sum + (h.nilai || 0), 0) / totalKuis).toFixed(2)
      : 0;
    
    const totalPBL = pblData.reduce((sum, [_, projects]) => sum + Object.keys(projects).length, 0);
    
    return {
      userId,
      totalKuis,
      rataKuis,
      totalPBL
    };
  };

  const handleGradeEssay = (hasilId, essayScores) => {
    const updated = hasilKuis.map(h => {
      if (h.id === hasilId) {
        const totalEssayScore = Object.values(essayScores).reduce((sum, val) => sum + val, 0);
        const pgScore = h.benar * (100 / h.totalSoal);
        const newNilai = Math.round((pgScore + totalEssayScore) / 2);
        
        return {
          ...h,
          essayScores,
          nilai: newNilai,
          status: 'dinilai'
        };
      }
      return h;
    });
    
    setHasilKuis(updated);
    localStorage.setItem('hasil_kuis', JSON.stringify(updated));
    alert('✅ Nilai essay berhasil disimpan!');
  };

  const handleGradePBL = (userId, pblId, nilai, feedback) => {
    const newNilai = {
      userId,
      pblId,
      judulPBL: pblList.find(p => p.id === parseInt(pblId))?.judul || '',
      nilai: parseInt(nilai),
      feedback,
      tanggalDinilai: new Date().toISOString()
    };
    
    // Check if already exists
    const exists = nilaiPBL.findIndex(n => n.userId === userId && n.pblId === pblId);
    let updated;
    
    if (exists >= 0) {
      updated = [...nilaiPBL];
      updated[exists] = newNilai;
    } else {
      updated = [...nilaiPBL, newNilai];
    }
    
    setNilaiPBL(updated);
    localStorage.setItem('jagat_kawruh_nilai_pbl', JSON.stringify(updated));
    alert('✅ Nilai PBL berhasil disimpan!');
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="nilai-siswa-guru-page">
        <div className="nilai-guru-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="header-content">
            <h1><span className="icon-chart inline-icon"></span> Nilai Siswa</h1>
            <p>Kelola dan berikan nilai untuk siswa</p>
          </div>
        </div>

        <div className="nilai-guru-container">
          {/* Tabs */}
          <div className="nilai-guru-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="icon-folder inline-icon-sm"></span> Overview Nilai
            </button>
            <button 
              className={`tab-btn ${activeTab === 'kuis' ? 'active' : ''}`}
              onClick={() => setActiveTab('kuis')}
            >
              <span className="icon-quiz inline-icon-sm"></span> Grading Kuis
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pbl' ? 'active' : ''}`}
              onClick={() => setActiveTab('pbl')}
            >
              <span className="icon-target inline-icon-sm"></span> Grading PBL
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="overview-table-container">
                <table className="overview-table">
                  <thead>
                    <tr>
                      <th>Email Siswa</th>
                      <th>Total Kuis</th>
                      <th>Rata² Kuis</th>
                      <th>Total PBL</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllStudents().map((userId, index) => {
                      const data = getStudentData(userId);
                      return (
                        <tr key={index}>
                          <td>{data.userId}</td>
                          <td>{data.totalKuis}</td>
                          <td>
                            <span className={`nilai-badge ${data.rataKuis >= 75 ? 'nilai-tinggi' : data.rataKuis >= 60 ? 'nilai-sedang' : 'nilai-rendah'}`}>
                              {data.rataKuis}
                            </span>
                          </td>
                          <td>{data.totalPBL}</td>
                          <td>
                            <span className="status-badge status-aktif">Aktif</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grading Kuis Tab */}
          {activeTab === 'kuis' && (
            <div className="tab-content">
              <div className="grading-header">
                <h3>Pilih Kuis untuk Grading</h3>
                <select 
                  value={selectedKuis || ''} 
                  onChange={(e) => setSelectedKuis(e.target.value ? parseInt(e.target.value) : null)}
                  className="select-kuis"
                >
                  <option value="">-- Pilih Kuis --</option>
                  {kuisList.map(kuis => (
                    <option key={kuis.id} value={kuis.id}>{kuis.judul}</option>
                  ))}
                </select>
              </div>

              {selectedKuis && (
                <GradingKuisSection 
                  kuisId={selectedKuis}
                  hasilKuis={hasilKuis.filter(h => h.kuisId === selectedKuis)}
                  onGrade={handleGradeEssay}
                />
              )}
            </div>
          )}

          {/* Grading PBL Tab */}
          {activeTab === 'pbl' && (
            <div className="tab-content">
              <div className="grading-header">
                <h3>Pilih PBL untuk Grading</h3>
                <select 
                  value={selectedPBL || ''} 
                  onChange={(e) => setSelectedPBL(e.target.value ? parseInt(e.target.value) : null)}
                  className="select-kuis"
                >
                  <option value="">-- Pilih PBL --</option>
                  {pblList.map(pbl => (
                    <option key={pbl.id} value={pbl.id}>{pbl.judul}</option>
                  ))}
                </select>
              </div>

              {selectedPBL && (
                <GradingPBLSection 
                  pblId={selectedPBL}
                  pblProgress={pblProgress}
                  nilaiPBL={nilaiPBL}
                  onGrade={handleGradePBL}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for Grading Kuis
function GradingKuisSection({ kuisId, hasilKuis, onGrade }) {
  const [expandedId, setExpandedId] = useState(null);
  const [essayScores, setEssayScores] = useState({});

  if (hasilKuis.length === 0) {
    return (
      <div className="empty-grading">
        <p>Belum ada siswa yang mengerjakan kuis ini</p>
      </div>
    );
  }

  return (
    <div className="grading-list">
      {hasilKuis.map(hasil => (
        <div key={hasil.id} className="grading-card">
          <div className="grading-card-header" onClick={() => setExpandedId(expandedId === hasil.id ? null : hasil.id)}>
            <div className="student-info">
              <h4>{hasil.userId}</h4>
              <span className="tanggal">{new Date(hasil.tanggal).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="score-info">
              <span className="benar-total">{hasil.benar}/{hasil.totalSoal}</span>
              <span className={`nilai-badge ${hasil.nilai >= 75 ? 'nilai-tinggi' : hasil.nilai >= 60 ? 'nilai-sedang' : 'nilai-rendah'}`}>
                {hasil.nilai || '-'}
              </span>
              <span className={expandedId === hasil.id ? 'arrow-up' : 'arrow-down'}>▼</span>
            </div>
          </div>

          {expandedId === hasil.id && (
            <div className="grading-card-body">
              <h5>Detail Jawaban:</h5>
              {hasil.jawaban && Array.isArray(hasil.jawaban) && hasil.jawaban.length > 0 ? (
                hasil.jawaban.map((jwb, idx) => (
                  <div key={idx} className="jawaban-item">
                    <div className="soal-info">
                      <strong>Soal {idx + 1}:</strong> {jwb.pertanyaan}
                    </div>
                    <div className="jawaban-info">
                      <span className="label">Jawaban:</span> {jwb.jawaban}
                    </div>
                    {jwb.tipe === 'essay' && (
                      <div className="essay-grading">
                        <label>Nilai Essay (0-100):</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100"
                          defaultValue={hasil.essayScores?.[idx] || 0}
                          onChange={(e) => {
                            setEssayScores(prev => ({
                              ...prev,
                              [idx]: parseInt(e.target.value) || 0
                            }));
                          }}
                          className="input-score"
                        />
                      </div>
                    )}
                    <div className={`status-jawaban ${jwb.benar ? 'benar' : 'salah'}`}>
                      {jwb.benar ? '✓ Benar' : '✗ Salah'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-grading">
                  <p>Tidak ada detail jawaban tersedia</p>
                </div>
              )}
              
              {hasil.jawaban && Array.isArray(hasil.jawaban) && hasil.jawaban.length > 0 && (
                <button 
                  className="btn-save-grade"
                  onClick={() => onGrade(hasil.id, essayScores)}
                >
                  💾 Simpan Nilai
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Component for Grading PBL
function GradingPBLSection({ pblId, pblProgress, nilaiPBL, onGrade }) {
  const [expandedUser, setExpandedUser] = useState(null);
  const [gradeForm, setGradeForm] = useState({});

  const getStudentsWithProgress = () => {
    const students = [];
    Object.entries(pblProgress).forEach(([userId, projects]) => {
      if (projects[pblId]) {
        students.push({
          userId,
          progress: projects[pblId]
        });
      }
    });
    return students;
  };

  const students = getStudentsWithProgress();

  if (students.length === 0) {
    return (
      <div className="empty-grading">
        <p>Belum ada siswa yang mengerjakan PBL ini</p>
      </div>
    );
  }

  return (
    <div className="grading-list">
      {students.map(({ userId, progress }) => {
        const existingNilai = nilaiPBL.find(n => n.userId === userId && n.pblId === pblId);
        
        return (
          <div key={userId} className="grading-card">
            <div className="grading-card-header" onClick={() => setExpandedUser(expandedUser === userId ? null : userId)}>
              <div className="student-info">
                <h4>{userId}</h4>
                <span className="progress-text">Progress: {progress.progress}%</span>
              </div>
              <div className="score-info">
                {existingNilai && (
                  <span className={`nilai-badge ${existingNilai.nilai >= 75 ? 'nilai-tinggi' : existingNilai.nilai >= 60 ? 'nilai-sedang' : 'nilai-rendah'}`}>
                    {existingNilai.nilai}
                  </span>
                )}
                <span className={expandedUser === userId ? 'arrow-up' : 'arrow-down'}>▼</span>
              </div>
            </div>

            {expandedUser === userId && (
              <div className="grading-card-body">
                <h5>Submission PBL:</h5>
                {progress.submissions && Object.entries(progress.submissions).map(([key, submission]) => (
                  <div key={key} className="pbl-submission-item">
                    <div className="submission-header">
                      <strong>Sintaks {key.split('-')[0]} - Tahap {key.split('-')[1]}</strong>
                      <span className="tanggal">{new Date(submission.submittedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="submission-content">
                      <p><strong>Jawaban:</strong></p>
                      <div className="jawaban-text">{submission.jawaban}</div>
                      
                      {submission.files && submission.files.length > 0 && (
                        <div className="submission-files">
                          <p><strong>File:</strong></p>
                          <div className="files-list">
                            {submission.files.map((file, idx) => (
                              <div key={idx} className="file-preview-item">
                                {file.type.startsWith('image/') ? (
                                  <img src={file.data} alt={file.name} className="preview-img" />
                                ) : (
                                  <div className="file-doc">📄 {file.name}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="grade-form">
                  <div className="form-group">
                    <label>Nilai (0-100):</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      defaultValue={existingNilai?.nilai || ''}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, [userId]: { ...prev[userId], nilai: e.target.value } }))}
                      className="input-score"
                    />
                  </div>
                  <div className="form-group">
                    <label>Feedback:</label>
                    <textarea 
                      defaultValue={existingNilai?.feedback || ''}
                      onChange={(e) => setGradeForm(prev => ({ ...prev, [userId]: { ...prev[userId], feedback: e.target.value } }))}
                      className="textarea-feedback"
                      rows="4"
                      placeholder="Berikan feedback untuk siswa..."
                    />
                  </div>
                  <button 
                    className="btn-save-grade"
                    onClick={() => {
                      const form = gradeForm[userId] || {};
                      if (!form.nilai) {
                        alert('Mohon isi nilai terlebih dahulu');
                        return;
                      }
                      onGrade(userId, pblId, form.nilai, form.feedback || '');
                    }}
                  >
                    💾 Simpan Nilai PBL
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NilaiSiswa;
