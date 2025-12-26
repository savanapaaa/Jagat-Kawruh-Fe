import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import { getPBLById, getPBLProgress, submitPBLTahap, unlockNextTahap } from '../../../services/dataService';
import './KerjakanPBL.css';

function KerjakanPBL() {
  const { pblId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pbl, setPbl] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentSintaks, setCurrentSintaks] = useState(1);
  const [currentTahap, setCurrentTahap] = useState(1);
  const [jawaban, setJawaban] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    const pblData = getPBLById(pblId);
    if (pblData) {
      setPbl(pblData);
      const userProgress = getPBLProgress(user?.email || 'guest')[pblId] || {
        currentSintaks: 1,
        currentTahap: 1,
        progress: 0,
        status: 'sedang',
        submissions: {}
      };
      setProgress(userProgress);
      setCurrentSintaks(userProgress.currentSintaks);
      setCurrentTahap(userProgress.currentTahap);
      
      // Load existing answer if any
      const submissionKey = `${userProgress.currentSintaks}-${userProgress.currentTahap}`;
      if (userProgress.submissions && userProgress.submissions[submissionKey]) {
        const savedAnswer = userProgress.submissions[submissionKey].jawaban;
        setJawaban(savedAnswer);
        // Set editor content
        if (editorRef.current) {
          editorRef.current.innerHTML = savedAnswer || '';
        }
        setUploadedFiles(userProgress.submissions[submissionKey].files || []);
      }
    } else {
      navigate('/siswa/pbl');
    }
  }, [pblId, user, navigate]);

  // Auto-save to localStorage
  useEffect(() => {
    if (jawaban && pblId && currentSintaks && currentTahap) {
      const storageKey = `pbl_draft_${pblId}_${currentSintaks}_${currentTahap}`;
      localStorage.setItem(storageKey, jawaban);
    }
  }, [jawaban, pblId, currentSintaks, currentTahap]);

  // Load draft from localStorage
  useEffect(() => {
    if (pblId && currentSintaks && currentTahap) {
      const storageKey = `pbl_draft_${pblId}_${currentSintaks}_${currentTahap}`;
      const draft = localStorage.getItem(storageKey);
      if (draft && !jawaban) {
        setJawaban(draft);
        if (editorRef.current) {
          editorRef.current.innerHTML = draft;
        }
      }
    }
  }, [pblId, currentSintaks, currentTahap]);

  // Editor commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setJawaban(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setJawaban(editorRef.current.innerHTML);
    }
  };

  const handleEditorPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertEmoji = (emoji) => {
    document.execCommand('insertText', false, emoji);
    if (editorRef.current) {
      setJawaban(editorRef.current.innerHTML);
    }
  };

  const insertFileToEditor = (file) => {
    if (!editorRef.current) return;

    const isImage = file.type.startsWith('image/');
    
    if (isImage) {
      // Insert image preview dalam editor
      const img = `<img src="${file.data}" alt="${file.name}" class="editor-image" />`;
      document.execCommand('insertHTML', false, img);
    } else {
      // Insert file attachment card dalam editor
      const fileIcon = file.type.includes('pdf') ? '📄' : 
                      file.type.includes('word') ? '📝' : 
                      file.type.includes('excel') ? '📊' : 
                      file.type.includes('powerpoint') ? '📑' : '📎';
      
      const fileSize = (file.size / 1024).toFixed(1) + ' KB';
      const attachmentCard = `
        <div class="editor-attachment" contenteditable="false">
          <span class="attachment-icon">${fileIcon}</span>
          <div class="attachment-info">
            <span class="attachment-name">${file.name}</span>
            <span class="attachment-size">${fileSize}</span>
          </div>
        </div>
      `;
      document.execCommand('insertHTML', false, attachmentCard);
    }
    
    if (editorRef.current) {
      setJawaban(editorRef.current.innerHTML);
    }
  };

  if (!pbl || !progress) {
    return <div>Loading...</div>;
  }

  const totalTahap = pbl.sintaks.reduce((sum, s) => sum + s.tahap.length, 0);
  const completedTahap = Object.keys(progress.submissions || {}).length;
  const overallProgress = Math.round((completedTahap / totalTahap) * 100);

  const currentSintaksData = pbl.sintaks.find(s => s.nomor === currentSintaks);
  const currentTahapData = currentSintaksData?.tahap.find(t => t.nomor === currentTahap);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newFiles => {
      // Simpan file di state untuk submit
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Insert file ke dalam editor
      newFiles.forEach(file => {
        insertFileToEditor(file);
      });
    });
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!jawaban.trim() && uploadedFiles.length === 0) {
      alert('Silakan isi jawaban atau upload file terlebih dahulu!');
      return;
    }

    const submittedProgress = submitPBLTahap(
      user?.email || 'guest', 
      parseInt(pblId), 
      currentSintaks, 
      currentTahap, 
      jawaban,
      uploadedFiles
    );
    
    // Calculate next step
    const currentTahapIndex = currentSintaksData.tahap.findIndex(t => t.nomor === currentTahap);
    const isLastTahapInSintaks = currentTahapIndex === currentSintaksData.tahap.length - 1;
    const isLastSintaks = currentSintaks === pbl.sintaks.length;

    let nextSintaks = currentSintaks;
    let nextTahap = currentTahap;

    if (isLastTahapInSintaks) {
      if (!isLastSintaks) {
        nextSintaks = currentSintaks + 1;
        nextTahap = 1;
      }
    } else {
      nextTahap = currentTahap + 1;
    }

    const newCompletedTahap = completedTahap + 1;
    const newProgress = Math.round((newCompletedTahap / totalTahap) * 100);

    if (isLastSintaks && isLastTahapInSintaks) {
      // Completed all
      unlockNextTahap(user?.email || 'guest', parseInt(pblId), nextSintaks, nextTahap, 100);
      alert('Selamat! Anda telah menyelesaikan seluruh tahapan PBL!');
      navigate('/siswa/pbl');
    } else {
      unlockNextTahap(user?.email || 'guest', parseInt(pblId), nextSintaks, nextTahap, newProgress);
      setCurrentSintaks(nextSintaks);
      setCurrentTahap(nextTahap);
      setJawaban('');
      setUploadedFiles([]);
      
      // Reload progress
      const updatedProgress = getPBLProgress(user?.email || 'guest')[pblId];
      setProgress(updatedProgress);
      
      alert('Jawaban berhasil disimpan! Lanjut ke tahap berikutnya.');
    }
  };

  const isTahapUnlocked = (sintaksNomor, tahapNomor) => {
    // Jika tahap sudah pernah dikerjakan/completed, harus bisa diakses
    const key = `${sintaksNomor}-${tahapNomor}`;
    if (progress.submissions && progress.submissions[key]) {
      return true;
    }
    
    // Logika unlock berdasarkan progress saat ini
    if (sintaksNomor < currentSintaks) return true;
    if (sintaksNomor === currentSintaks && tahapNomor <= currentTahap) return true;
    return false;
  };

  const isTahapCompleted = (sintaksNomor, tahapNomor) => {
    const key = `${sintaksNomor}-${tahapNomor}`;
    return progress.submissions && progress.submissions[key];
  };

  const handleNavigateToTahap = (sintaksNomor, tahapNomor) => {
    if (!isTahapUnlocked(sintaksNomor, tahapNomor)) {
      alert('Tahap ini masih terkunci. Selesaikan tahap sebelumnya terlebih dahulu.');
      return;
    }

    setCurrentSintaks(sintaksNomor);
    setCurrentTahap(tahapNomor);
    
    const submissionKey = `${sintaksNomor}-${tahapNomor}`;
    if (progress.submissions && progress.submissions[submissionKey]) {
      const savedAnswer = progress.submissions[submissionKey].jawaban;
      setJawaban(savedAnswer);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedAnswer || '';
      }
      setUploadedFiles(progress.submissions[submissionKey].files || []);
    } else {
      // Load draft
      const storageKey = `pbl_draft_${pblId}_${sintaksNomor}_${tahapNomor}`;
      const draft = localStorage.getItem(storageKey);
      setJawaban(draft || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = draft || '';
      }
      setUploadedFiles([]);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="siswa" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className="kerjakan-pbl">
        <div className="pbl-topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <button className="btn-back" onClick={() => navigate('/siswa/pbl')}>
              ← Kembali
            </button>
          </div>
          <div className="topbar-center">
            <h2 className="pbl-title-top">{pbl.judul}</h2>
          </div>
        </div>

        <div className="pbl-container">
          {/* Header Info */}
          <div className="pbl-header-info">
            <div className="info-item">
              <span className="info-label">Kelas:</span>
              <span className="info-value">{pbl.kelas}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Deadline:</span>
              <span className="info-value">{new Date(pbl.deadline).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status Pengerjaan:</span>
              <span className="status-badge-progress">Sedang Mengerjakan</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="overall-progress">
            <div className="progress-header">
              <h3>Progress saat ini: {overallProgress}%</h3>
              <p>Tahapan: Sintaks {currentSintaks} - Tahap {currentTahap}</p>
            </div>
            <div className="progress-bar-large">
              <div className="progress-fill-large" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          {/* Sintaks Navigation */}
          <div className="sintaks-navigation">
            {pbl.sintaks.map(sintaks => {
              const isAccessible = isTahapUnlocked(sintaks.nomor, 1);
              
              return (
                <button
                  key={sintaks.nomor}
                  className={`sintaks-tab ${currentSintaks === sintaks.nomor ? 'active' : ''} ${!isAccessible ? 'locked' : ''}`}
                  onClick={() => {
                    if (isAccessible) {
                      handleNavigateToTahap(sintaks.nomor, 1);
                    }
                  }}
                  disabled={!isAccessible}
                >
                  <span className="sintaks-nomor">Sintaks {sintaks.nomor}</span>
                  <span className="sintaks-judul">{sintaks.judul}</span>
                </button>
              );
            })}
          </div>

          {/* Tahap Navigation */}
          <div className="tahap-navigation">
            {currentSintaksData.tahap.map(tahap => {
              const unlocked = isTahapUnlocked(currentSintaks, tahap.nomor);
              const completed = isTahapCompleted(currentSintaks, tahap.nomor);
              
              return (
                <button
                  key={tahap.nomor}
                  className={`tahap-btn ${currentTahap === tahap.nomor ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => handleNavigateToTahap(currentSintaks, tahap.nomor)}
                  disabled={!unlocked}
                >
                  {completed ? '✓' : unlocked ? tahap.nomor : '🔒'}
                  <span>{tahap.judul}</span>
                </button>
              );
            })}
          </div>

          {/* Tahap Content */}
          <div className="tahap-content">
            <div className="tahap-header">
              <h2>Tahap {currentTahap}: {currentTahapData.judul}</h2>
            </div>

            <div className="tahap-instruksi">
              <h3>📋 Instruksi</h3>
              <p>{currentTahapData.instruksi || 'Silakan kerjakan tahap ini sesuai petunjuk guru.'}</p>
            </div>

            <div className="jawaban-section">
              <label>✍️ Tulis Jawaban Anda</label>
              
              {/* Rich Text Editor Toolbar */}
              {!isTahapCompleted(currentSintaks, currentTahap) && (
                <div className="editor-toolbar">
                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('bold')}
                      title="Bold (Ctrl+B)"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('italic')}
                      title="Italic (Ctrl+I)"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('underline')}
                      title="Underline (Ctrl+U)"
                    >
                      <u>U</u>
                    </button>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('justifyLeft')}
                      title="Rata Kiri"
                    >
                      <span className="icon">←</span>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('justifyCenter')}
                      title="Rata Tengah"
                    >
                      <span className="icon">⚌</span>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('justifyRight')}
                      title="Rata Kanan"
                    >
                      <span className="icon">→</span>
                    </button>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('insertUnorderedList')}
                      title="Bullet List"
                    >
                      <span className="icon">☰</span>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => execCommand('insertOrderedList')}
                      title="Numbered List"
                    >
                      <span className="icon">⁝</span>
                    </button>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={insertLink}
                      title="Insert Link"
                    >
                      🔗
                    </button>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-group emoji-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertEmoji('😊')}
                      title="Insert Emoji"
                    >
                      😊
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertEmoji('👍')}
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertEmoji('💡')}
                    >
                      💡
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => insertEmoji('✨')}
                    >
                      ✨
                    </button>
                  </div>

                  <div className="toolbar-divider"></div>

                  <div className="toolbar-group file-group">
                    <label className="toolbar-btn toolbar-btn-file" title="Upload File/Gambar">
                      <span className="icon">📎</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Rich Text Editor Area */}
              <div
                ref={editorRef}
                className={`editor-content ${isTahapCompleted(currentSintaks, currentTahap) ? 'disabled' : ''}`}
                contentEditable={!isTahapCompleted(currentSintaks, currentTahap)}
                onInput={handleEditorInput}
                onPaste={handleEditorPaste}
                data-placeholder="Tuliskan jawaban Anda di sini... Anda dapat menggunakan toolbar di atas untuk memformat teks."
                suppressContentEditableWarning={true}
              />
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>File yang sudah diupload:</h4>
                <div className="files-grid">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      {file.type.startsWith('image/') ? (
                        <div className="file-preview-image">
                          <img src={file.data} alt={file.name} />
                        </div>
                      ) : (
                        <div className="file-preview-doc">
                          <span className="file-icon">📄</span>
                        </div>
                      )}
                      <div className="file-info">
                        <p className="file-name">{file.name}</p>
                        <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      {!isTahapCompleted(currentSintaks, currentTahap) && (
                        <button
                          className="btn-remove-file"
                          onClick={() => handleRemoveFile(index)}
                          title="Hapus file"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isTahapCompleted(currentSintaks, currentTahap) ? (
              <button className="btn-submit-tahap" onClick={handleSubmit}>
                💾 Simpan & Lanjut ke Tahap Berikutnya
              </button>
            ) : (
              <div className="completed-notice">
                ✅ Tahap ini sudah selesai dikerjakan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KerjakanPBL;
