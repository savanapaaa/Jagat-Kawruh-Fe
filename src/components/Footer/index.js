import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-brand-title">Jagat Kawruh</h3>
            <p className="footer-tagline">
              Platform pembelajaran digital untuk masa depan pendidikan Indonesia
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Navigasi</h4>
              <a href="#home">Home</a>
              <a href="#tentang">Tentang Kami</a>
              <a href="#fitur">Fitur</a>
            </div>

            <div className="footer-column">
              <h4>Dukungan</h4>
              <a href="#bantuan">Bantuan</a>
              <a href="#kontak">Kontak</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privasi">Kebijakan Privasi</a>
              <a href="#syarat">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Jagat Kawruh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
