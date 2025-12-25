import React from 'react';
import './styles/About.css';

function About() {
  return (
    <section className="about" id="tentang">
      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <div className="about-card">
              <div className="card-bg"></div>
              <div className="about-stats-card">
                <h3>💡</h3>
                <p>Platform pembelajaran yang inovatif dan mudah digunakan</p>
              </div>
            </div>
          </div>

          <div className="about-text">
            <div className="section-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
              <h2>Tentang Jagat Kawruh</h2>
            </div>
            
            <p className="about-description">
              <strong>Jagat Kawruh</strong> adalah platform media pembelajaran berbasis web yang 
              dirancang khusus untuk memudahkan proses belajar mengajar di era digital. 
              Kami hadir untuk menjembatani guru dan siswa dalam menciptakan pengalaman 
              pembelajaran yang lebih interaktif, efisien, dan menyenangkan.
            </p>

            <p className="about-description">
              Dengan fitur-fitur lengkap seperti manajemen materi, tugas online, kuis 
              interaktif, dan sistem penilaian otomatis, kami berkomitmen untuk meningkatkan 
              kualitas pendidikan dan memberikan kemudahan akses pembelajaran untuk semua.
            </p>

            <div className="about-features">
              <div className="about-feature-item">
                <span className="feature-check">✓</span>
                <span>Interface yang user-friendly</span>
              </div>
              <div className="about-feature-item">
                <span className="feature-check">✓</span>
                <span>Akses pembelajaran 24/7</span>
              </div>
              <div className="about-feature-item">
                <span className="feature-check">✓</span>
                <span>Sistem keamanan data terjamin</span>
              </div>
              <div className="about-feature-item">
                <span className="feature-check">✓</span>
                <span>Dukungan teknis profesional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
