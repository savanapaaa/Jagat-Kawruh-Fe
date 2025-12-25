// Script untuk generate dummy notifikasi
// Copy paste ke browser console untuk testing

const dummyNotifications = [
  {
    id: Date.now() + 1,
    targetUser: 'siswa@test.com',
    tipe: 'materi',
    judul: 'Materi Baru Tersedia',
    pesan: 'Materi "Pengenalan Algoritma" telah ditambahkan oleh Pak Ahmad',
    tanggal: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
    isRead: false
  },
  {
    id: Date.now() + 2,
    targetUser: 'siswa@test.com',
    tipe: 'kuis',
    judul: 'Kuis Baru Tersedia',
    pesan: 'Kuis "Media Pembelajaran Interaktif" telah tersedia. Deadline: 30 Desember 2025',
    tanggal: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 jam lalu
    isRead: false
  },
  {
    id: Date.now() + 3,
    targetUser: 'siswa@test.com',
    tipe: 'nilai',
    judul: 'Nilai Kuis Sudah Keluar',
    pesan: 'Nilai kuis "Dasar Pemrograman" Anda: 85',
    tanggal: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 hari lalu
    isRead: true
  },
  {
    id: Date.now() + 4,
    targetUser: 'siswa@test.com',
    tipe: 'pbl',
    judul: 'Pengingat Deadline PBL',
    pesan: 'Jangan lupa selesaikan project "Sistem Informasi Sekolah" sebelum 28 Desember 2025',
    tanggal: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 hari lalu
    isRead: false
  },
  {
    id: Date.now() + 5,
    targetUser: 'siswa@test.com',
    tipe: 'guru',
    judul: 'Pesan dari Guru',
    pesan: 'Besok ada kuis mendadak, silahkan pelajari materi Bab 1-3',
    tanggal: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 jam lalu
    isRead: false
  },
  {
    id: Date.now() + 6,
    targetUser: 'siswa@test.com',
    tipe: 'info',
    judul: 'Selamat Datang!',
    pesan: 'Selamat datang di Jagat Kawruh, platform pembelajaran interaktif',
    tanggal: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 minggu lalu
    isRead: true
  },
  // Notifikasi untuk guru
  {
    id: Date.now() + 7,
    targetUser: 'guru@test.com',
    tipe: 'info',
    judul: 'Siswa Mengumpulkan Tugas',
    pesan: 'Andi Pratama telah mengumpulkan tugas PBL "Sistem Informasi"',
    tanggal: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 jam lalu
    isRead: false
  },
  {
    id: Date.now() + 8,
    targetUser: 'guru@test.com',
    tipe: 'kuis',
    judul: 'Siswa Menyelesaikan Kuis',
    pesan: '15 siswa telah menyelesaikan kuis "Media Pembelajaran"',
    tanggal: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 jam lalu
    isRead: false
  }
];

// Simpan ke localStorage
localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(dummyNotifications));
console.log('✅ Dummy notifications created!');
console.log('Total:', dummyNotifications.length, 'notifications');
console.log('For siswa@test.com:', dummyNotifications.filter(n => n.targetUser === 'siswa@test.com').length);
console.log('For guru@test.com:', dummyNotifications.filter(n => n.targetUser === 'guru@test.com').length);
