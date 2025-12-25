import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/Sidebar';
import { getKuisById, getSoalByKuisId } from '../../../services/dataService';
import './KerjakanKuis.css';

function KerjakanKuis() {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kuis, setKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [currentSoal, setCurrentSoal] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasilAkhir, setHasilAkhir] = useState(null);

  useEffect(() => {
    const kuisData = getKuisById(kuisId);
    if (!kuisData) {
      alert('Kuis tidak ditemukan!');
      navigate('/siswa/kuis');
      return;
    }
    
    const soal = getSoalByKuisId(kuisId);
    if (soal.length === 0) {
      alert('Kuis ini belum memiliki soal!');
      navigate('/siswa/kuis');
      return;
    }

    setKuis(kuisData);
    setSoalList(soal);
    setTimeLeft(kuisData.durasi * 60); // Convert menit ke detik
  }, [kuisId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleJawaban = (soalId, value) => {
    setJawaban({
      ...jawaban,
      [soalId]: value
    });
  };

  const handleSubmit = () => {
    // Hitung nilai
    let benar = 0;
    let totalPoin = 0;
    let poinDidapat = 0;

    soalList.forEach(soal => {
      totalPoin += soal.poin;
      if (soal.tipe === 'pilihan_ganda') {
        if (jawaban[soal.id] === soal.jawabanBenar) {
          benar++;
          poinDidapat += soal.poin;
        }
      }
    });

    const nilaiAkhir = Math.round((poinDidapat / totalPoin) * 100);

    // Simpan hasil ke localStorage
    const hasil = {
      id: Date.now(),
      userId: user?.email || 'guest',
      kuisId: parseInt(kuisId),
      judulKuis: kuis.judul,
      nilai: nilaiAkhir,
      benar,
      totalSoal: soalList.length,
      poinDidapat,
      totalPoin,
      tanggal: new Date().toISOString(),
      jawaban
    };

    const hasilKuis = JSON.parse(localStorage.getItem('hasil_kuis') || '[]');
    hasilKuis.push(hasil);
    localStorage.setItem('hasil_kuis', JSON.stringify(hasilKuis));

    setIsFinished(true);
    setHasilAkhir({
      nilai: nilaiAkhir,
      benar,
      total: soalList.length,
      poinDidapat,
      totalPoin
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!kuis || soalList.length === 0) {
    return <div>Loading...</div>;
  }

  const soal = soalList[currentSoal];

  // Completion Screen
  if (isFinished && hasilAkhir) {
    return (
      <div className="dashboard-layout">
        <Sidebar role="siswa" />
        
        <div className="dashboard-main">
          <div className="completion-screen">
            <div className="completion-card">
              <div className="completion-icon">
                {hasilAkhir.nilai >= 75 ? '🎉' : hasilAkhir.nilai >= 60 ? '👍' : '💪'}
              </div>
              <h1 className="completion-title">Kuis Selesai!</h1>
              <p className="completion-subtitle">Terima kasih telah mengerjakan kuis</p>
              
              <div className="hasil-summary">
                <div className="hasil-nilai">
                  <span className="nilai-label">Nilai Anda</span>
                  <span className={`nilai-angka ${hasilAkhir.nilai >= 75 ? 'tinggi' : hasilAkhir.nilai >= 60 ? 'sedang' : 'rendah'}`}>
                    {hasilAkhir.nilai}
                  </span>
                </div>
                
                <div className="hasil-details">
                  <div className="detail-item">
                    <span className="detail-label">Benar</span>
                    <span className="detail-value">{hasilAkhir.benar}/{hasilAkhir.total}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Poin</span>
                    <span className="detail-value">{hasilAkhir.poinDidapat}/{hasilAkhir.totalPoin}</span>
                  </div>
                </div>
              </div>

              <div className="completion-actions">
                <button className="btn-primary" onClick={() => navigate('/siswa/kuis')}>
                  Kembali ke Daftar Kuis
                </button>
                <button className="btn-secondary" onClick={() => navigate('/siswa/nilai')}>
                  Lihat Semua Nilai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="siswa" />
      
      <div className="dashboard-main">
        <div className="kerjakan-kuis">
          {/* Header */}
          <div className="kuis-header-bar">
            <div className="kuis-info">
              <h2>{kuis.judul}</h2>
              <p>{kuis.kelas}</p>
            </div>
            <div className="kuis-timer">
              <span className="timer-icon">⏱️</span>
              <span className={`timer-text ${timeLeft < 60 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="kuis-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentSoal + 1) / soalList.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Soal {currentSoal + 1} dari {soalList.length}
            </div>
          </div>

          {/* Soal */}
          <div className="soal-container">
            <div className="soal-header">
              <span className="soal-number">Soal #{currentSoal + 1}</span>
              <span className="soal-poin">⭐ {soal.poin} poin</span>
            </div>

            <div className="soal-pertanyaan">
              <p>{soal.pertanyaan}</p>
            </div>

            {/* Jawaban */}
            {soal.tipe === 'pilihan_ganda' ? (
              <div className="pilihan-ganda">
                {soal.opsi.map((opsi, idx) => (
                  <label key={idx} className="opsi-item">
                    <input
                      type="radio"
                      name={`soal-${soal.id}`}
                      value={idx}
                      checked={jawaban[soal.id] === idx}
                      onChange={() => handleJawaban(soal.id, idx)}
                    />
                    <span className="opsi-label">{['A', 'B', 'C', 'D'][idx]}.</span>
                    <span className="opsi-text">{opsi}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="essay-answer">
                <textarea
                  rows="6"
                  placeholder="Tulis jawaban Anda di sini..."
                  value={jawaban[soal.id] || ''}
                  onChange={(e) => handleJawaban(soal.id, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="kuis-navigation">
            <button 
              className="btn-nav"
              onClick={() => setCurrentSoal(Math.max(0, currentSoal - 1))}
              disabled={currentSoal === 0}
            >
              ← Sebelumnya
            </button>

            <div className="soal-indicators">
              {soalList.map((_, idx) => (
                <button
                  key={idx}
                  className={`soal-indicator ${idx === currentSoal ? 'active' : ''} ${jawaban[soalList[idx].id] !== undefined ? 'answered' : ''}`}
                  onClick={() => setCurrentSoal(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentSoal < soalList.length - 1 ? (
              <button 
                className="btn-nav"
                onClick={() => setCurrentSoal(Math.min(soalList.length - 1, currentSoal + 1))}
              >
                Selanjutnya →
              </button>
            ) : (
              <button 
                className="btn-submit"
                onClick={handleSubmit}
              >
                Selesai & Kumpulkan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KerjakanKuis;
