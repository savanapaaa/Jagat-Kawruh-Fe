import React from 'react';
import Button from '../../components/Button';
import './styles/CTA.css';

function CTA() {
  return (
    <section className="cta">
      <div className="cta-background">
        <div className="cta-shape cta-shape-1"></div>
        <div className="cta-shape cta-shape-2"></div>
      </div>
      
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Siap Memulai Pembelajaran Digital?</h2>
          <p className="cta-description">
            Bergabunglah dengan ribuan siswa dan guru yang telah merasakan kemudahan 
            belajar mengajar bersama Jagat Kawruh. Daftar sekarang dan mulai 
            perjalanan pembelajaran digital Anda!
          </p>
          <div className="cta-buttons">
            <Button variant="primary" className="cta-btn">Daftar Sekarang</Button>
            <Button variant="outline" className="cta-btn">Hubungi Kami</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
