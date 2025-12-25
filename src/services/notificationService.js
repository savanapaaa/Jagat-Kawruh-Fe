// Helper functions untuk mengelola notifikasi

export const createNotification = (data) => {
  const notif = {
    id: Date.now() + Math.random(),
    targetUser: data.targetUser, // email user yang menerima
    tipe: data.tipe, // 'materi', 'kuis', 'nilai', 'pbl', 'guru', 'info'
    judul: data.judul,
    pesan: data.pesan,
    tanggal: new Date().toISOString(),
    isRead: false,
    ...data
  };

  const stored = localStorage.getItem('jagat_kawruh_notifikasi');
  const allNotifs = stored ? JSON.parse(stored) : [];
  allNotifs.push(notif);
  localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(allNotifs));
  
  return notif;
};

export const createBulkNotifications = (targetUsers, data) => {
  const notifs = targetUsers.map(userEmail => 
    createNotification({
      ...data,
      targetUser: userEmail
    })
  );
  return notifs;
};

export const getNotifications = (userEmail) => {
  const stored = localStorage.getItem('jagat_kawruh_notifikasi');
  if (!stored) return [];
  
  const allNotifs = JSON.parse(stored);
  return allNotifs
    .filter(n => n.targetUser === userEmail)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
};

export const getUnreadCount = (userEmail) => {
  const notifs = getNotifications(userEmail);
  return notifs.filter(n => !n.isRead).length;
};

export const markAsRead = (notifId) => {
  const stored = localStorage.getItem('jagat_kawruh_notifikasi');
  if (!stored) return;
  
  const allNotifs = JSON.parse(stored);
  const updated = allNotifs.map(n => 
    n.id === notifId ? { ...n, isRead: true } : n
  );
  localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(updated));
};

export const markAllAsRead = (userEmail) => {
  const stored = localStorage.getItem('jagat_kawruh_notifikasi');
  if (!stored) return;
  
  const allNotifs = JSON.parse(stored);
  const updated = allNotifs.map(n => 
    n.targetUser === userEmail ? { ...n, isRead: true } : n
  );
  localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(updated));
};

export const deleteNotification = (notifId) => {
  const stored = localStorage.getItem('jagat_kawruh_notifikasi');
  if (!stored) return;
  
  const allNotifs = JSON.parse(stored);
  const filtered = allNotifs.filter(n => n.id !== notifId);
  localStorage.setItem('jagat_kawruh_notifikasi', JSON.stringify(filtered));
};

// Contoh penggunaan:
// Notifikasi materi baru
export const notifyMateriBaruToAllSiswa = (materiData) => {
  // Get all siswa emails (nanti dari backend)
  const siswaEmails = ['siswa@test.com']; // dummy
  
  return createBulkNotifications(siswaEmails, {
    tipe: 'materi',
    judul: 'Materi Baru Tersedia',
    pesan: `Materi "${materiData.judul}" telah ditambahkan oleh guru`
  });
};

// Notifikasi kuis baru
export const notifyKuisBaruToAllSiswa = (kuisData) => {
  const siswaEmails = ['siswa@test.com']; // dummy
  
  return createBulkNotifications(siswaEmails, {
    tipe: 'kuis',
    judul: 'Kuis Baru Tersedia',
    pesan: `Kuis "${kuisData.judul}" telah tersedia. Deadline: ${kuisData.deadline || 'Belum ditentukan'}`
  });
};

// Notifikasi nilai kuis sudah keluar
export const notifyNilaiKuisToSiswa = (siswaEmail, kuisJudul, nilai) => {
  return createNotification({
    targetUser: siswaEmail,
    tipe: 'nilai',
    judul: 'Nilai Kuis Sudah Keluar',
    pesan: `Nilai kuis "${kuisJudul}" Anda: ${nilai}`
  });
};

// Notifikasi nilai PBL sudah keluar
export const notifyNilaiPBLToSiswa = (siswaEmail, pblJudul, nilai) => {
  return createNotification({
    targetUser: siswaEmail,
    tipe: 'nilai',
    judul: 'Nilai PBL Sudah Keluar',
    pesan: `Project PBL "${pblJudul}" Anda telah dinilai. Nilai: ${nilai}`
  });
};

// Notifikasi deadline PBL
export const notifyDeadlinePBL = (siswaEmail, pblJudul, deadline) => {
  return createNotification({
    targetUser: siswaEmail,
    tipe: 'pbl',
    judul: 'Pengingat Deadline PBL',
    pesan: `Jangan lupa selesaikan project "${pblJudul}" sebelum ${deadline}`
  });
};

// Notifikasi dari guru
export const notifyFromGuru = (siswaEmail, judul, pesan) => {
  return createNotification({
    targetUser: siswaEmail,
    tipe: 'guru',
    judul,
    pesan
  });
};
