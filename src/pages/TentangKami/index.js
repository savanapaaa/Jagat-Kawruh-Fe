import React from 'react';
import './TentangKami.css';

function TentangKami() {
  return (
    <div className="tentang-kami-page">
      <section className="tentang-hero">
        <div className="container">
          <h1>Tentang Kami</h1>
          <p>Mengenal lebih dekat platform pembelajaran digital Jagat Kawruh</p>
        </div>
      </section>

      <section className="tentang-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Siapa Kami?</h2>
              <p>
                Jagat Kawruh adalah platform media pembelajaran berbasis web yang dirancang untuk memudahkan proses belajar mengajar antara guru dan siswa. Kami hadir dengan visi menciptakan ekosistem digital yang modern, efisien, dan mudah diakses.
              </p>
              <p>
                Dengan fitur-fitur yang lengkap, kami membantu guru dalam mengelola materi pembelajaran, memberikan tugas, dan memantau perkembangan siswa. Sementara siswa dapat mengakses materi kapan saja, mengerjakan tugas, dan melihat progress belajar mereka secara real-time.
              </p>
            </div>
            <div className="content-image">
              <div className="image-placeholder">
                <span className="icon">🎓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="visi-misi">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card">
              <div className="vm-icon">🎯</div>
              <h3>Visi</h3>
              <p>
                Menjadi platform pembelajaran digital terdepan yang memberdayakan pendidikan Indonesia melalui teknologi yang inovatif dan mudah diakses.
              </p>
            </div>
            <div className="vm-card">
              <div className="vm-icon">🚀</div>
              <h3>Misi</h3>
              <p>
                Menyediakan solusi pembelajaran digital yang efektif, efisien, dan berkualitas untuk meningkatkan kualitas pendidikan di Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="nilai-section">
        <div className="container">
          <h2>Nilai-Nilai Kami</h2>
          <div className="nilai-grid">
            <div className="nilai-card">
              <div className="nilai-icon">💡</div>
              <h4>Inovasi</h4>
              <p>Terus berinovasi untuk memberikan pengalaman belajar terbaik</p>
            </div>
            <div className="nilai-card">
              <div className="nilai-icon">🤝</div>
              <h4>Kolaborasi</h4>
              <p>Membangun ekosistem pembelajaran yang kolaboratif</p>
            </div>
            <div className="nilai-card">
              <div className="nilai-icon">⭐</div>
              <h4>Kualitas</h4>
              <p>Menjaga kualitas konten dan layanan yang kami berikan</p>
            </div>
            <div className="nilai-card">
              <div className="nilai-icon">🌟</div>
              <h4>Aksesibilitas</h4>
              <p>Mudah diakses kapan saja dan di mana saja</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Tim Kami</h2>
          <p className="section-subtitle">Kenalan dengan orang-orang di balik Jagat Kawruh</p>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">👨‍💻</div>
              <h4>John Doe</h4>
              <p className="team-role">CEO & Founder</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍💼</div>
              <h4>Jane Smith</h4>
              <p className="team-role">Product Manager</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👨‍🎨</div>
              <h4>Mike Johnson</h4>
              <p className="team-role">Lead Designer</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍💻</div>
              <h4>Sarah Williams</h4>
              <p className="team-role">Lead Developer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TentangKami;
