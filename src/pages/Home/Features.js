import React from 'react';
import './styles/Features.css';

function Features() {
  const features = [
    {
      icon: '📖',
      title: 'Materi Terstruktur',
      description: 'Materi pembelajaran yang disusun secara sistematis dan mudah dipahami oleh siswa.',
    },
    {
      icon: '✍️',
      title: 'Tugas & Kuis Online',
      description: 'Kerjakan tugas dan kuis secara online dengan sistem yang interaktif dan mudah digunakan.',
    },
    {
      icon: '🤖',
      title: 'Penilaian Otomatis',
      description: 'Sistem penilaian otomatis yang memberikan feedback cepat dan akurat untuk setiap tugas.',
    },
    {
      icon: '👥',
      title: 'Akses Guru & Siswa',
      description: 'Platform terintegrasi yang memudahkan kolaborasi antara guru dan siswa.',
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-title">
          <h2>Fitur Unggulan</h2>
          <p>Berbagai fitur lengkap yang mendukung proses pembelajaran digital Anda</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
