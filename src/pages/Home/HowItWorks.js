import React from 'react';
import './styles/HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Daftar Akun',
      description: 'Buat akun Anda dengan mudah dan cepat menggunakan email atau nomor telepon.',
    },
    {
      number: '02',
      title: 'Login ke Platform',
      description: 'Masuk ke platform menggunakan kredensial yang telah Anda buat.',
    },
    {
      number: '03',
      title: 'Akses Materi',
      description: 'Jelajahi berbagai materi pembelajaran yang telah disediakan oleh guru.',
    },
    {
      number: '04',
      title: 'Kerjakan Tugas',
      description: 'Selesaikan tugas dan kuis yang diberikan sesuai dengan jadwal.',
    },
    {
      number: '05',
      title: 'Lihat Nilai',
      description: 'Pantau perkembangan belajar Anda melalui nilai dan feedback yang diberikan.',
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-title">
          <h2>Cara Kerja</h2>
          <p>Langkah mudah untuk memulai pembelajaran digital bersama kami</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-item" key={index}>
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
