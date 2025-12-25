import React from 'react';
import Button from '../../components/Button';
import './styles/Hero.css';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Platform Pembelajaran Modern</span>
            <h1 className="hero-title">
              Belajar Lebih Mudah, <span className="highlight">Hasil Lebih Baik</span>
            </h1>
            <p className="hero-description">
              Platform media pembelajaran yang menghubungkan siswa dan guru dalam satu ekosistem digital yang modern dan efisien
            </p>
            <div className="hero-buttons">
              <Button variant="primary" size="large">Mulai Belajar</Button>
              <Button variant="outline" size="large">Pelajari Lebih Lanjut</Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e1e5e1f9f7c8d6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2?width=600" 
                alt="Platform Pembelajaran" 
                className="hero-illustration-image"
              />
              <div className="satisfaction-badge">
                <div className="satisfaction-icon">📈</div>
                <div className="satisfaction-text">
                  <h3>98%</h3>
                  <p>Tingkat Kepuasan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

