// Data Service Layer - Abstraction untuk localStorage (nanti ganti ke API)
// Nanti tinggal ganti implementasi fungsi-fungsi ini pakai fetch/axios

const STORAGE_KEYS = {
  MATERI: 'jagat_kawruh_materi',
  KUIS: 'jagat_kawruh_kuis',
  SOAL: 'jagat_kawruh_soal',
  MATERI_PROGRESS: 'jagat_kawruh_materi_progress',
  PBL: 'jagat_kawruh_pbl',
  PBL_PROGRESS: 'jagat_kawruh_pbl_progress',
  SISWA: 'jagat_kawruh_siswa',
};

// ============= MATERI SERVICE =============

export const getMateriList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERI);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting materi:', error);
    return [];
  }
};

export const addMateri = (materi) => {
  try {
    const materiList = getMateriList();
    const newMateri = {
      ...materi,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    materiList.push(newMateri);
    localStorage.setItem(STORAGE_KEYS.MATERI, JSON.stringify(materiList));
    return newMateri;
  } catch (error) {
    console.error('Error adding materi:', error);
    throw error;
  }
};

export const updateMateri = (id, updatedData) => {
  try {
    const materiList = getMateriList();
    const index = materiList.findIndex(m => m.id === id);
    if (index !== -1) {
      materiList[index] = { ...materiList[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.MATERI, JSON.stringify(materiList));
      return materiList[index];
    }
    throw new Error('Materi not found');
  } catch (error) {
    console.error('Error updating materi:', error);
    throw error;
  }
};

export const deleteMateri = (id) => {
  try {
    const materiList = getMateriList();
    const filtered = materiList.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MATERI, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting materi:', error);
    throw error;
  }
};

// ============= KUIS SERVICE =============

export const getKuisList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KUIS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting kuis:', error);
    return [];
  }
};

export const addKuis = (kuis) => {
  try {
    const kuisList = getKuisList();
    const newKuis = {
      ...kuis,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    kuisList.push(newKuis);
    localStorage.setItem(STORAGE_KEYS.KUIS, JSON.stringify(kuisList));
    return newKuis;
  } catch (error) {
    console.error('Error adding kuis:', error);
    throw error;
  }
};

export const updateKuis = (id, updatedData) => {
  try {
    const kuisList = getKuisList();
    const index = kuisList.findIndex(k => k.id === id);
    if (index !== -1) {
      kuisList[index] = { ...kuisList[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.KUIS, JSON.stringify(kuisList));
      return kuisList[index];
    }
    throw new Error('Kuis not found');
  } catch (error) {
    console.error('Error updating kuis:', error);
    throw error;
  }
};

export const deleteKuis = (id) => {
  try {
    const kuisList = getKuisList();
    const filtered = kuisList.filter(k => k.id !== id);
    localStorage.setItem(STORAGE_KEYS.KUIS, JSON.stringify(filtered));
    
    // Hapus juga soal-soal yang terkait
    const soalList = getSoalByKuisId(id);
    soalList.forEach(soal => deleteSoal(soal.id));
    
    return true;
  } catch (error) {
    console.error('Error deleting kuis:', error);
    throw error;
  }
};

export const getKuisById = (id) => {
  try {
    const kuisList = getKuisList();
    return kuisList.find(k => k.id === parseInt(id));
  } catch (error) {
    console.error('Error getting kuis by id:', error);
    return null;
  }
};

// ============= SOAL SERVICE =============

export const getSoalList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SOAL);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting soal:', error);
    return [];
  }
};

export const getSoalByKuisId = (kuisId) => {
  try {
    const soalList = getSoalList();
    return soalList.filter(s => s.kuisId === parseInt(kuisId));
  } catch (error) {
    console.error('Error getting soal by kuis id:', error);
    return [];
  }
};

export const addSoal = (soal) => {
  try {
    const soalList = getSoalList();
    const newSoal = {
      ...soal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    soalList.push(newSoal);
    localStorage.setItem(STORAGE_KEYS.SOAL, JSON.stringify(soalList));
    return newSoal;
  } catch (error) {
    console.error('Error adding soal:', error);
    throw error;
  }
};

export const updateSoal = (id, updatedData) => {
  try {
    const soalList = getSoalList();
    const index = soalList.findIndex(s => s.id === id);
    if (index !== -1) {
      soalList[index] = { ...soalList[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.SOAL, JSON.stringify(soalList));
      return soalList[index];
    }
    throw new Error('Soal not found');
  } catch (error) {
    console.error('Error updating soal:', error);
    throw error;
  }
};

export const deleteSoal = (id) => {
  try {
    const soalList = getSoalList();
    const filtered = soalList.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SOAL, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting soal:', error);
    throw error;
  }
};

/* 
==============================================
MIGRATION GUIDE ke Backend API:
==============================================

Nanti tinggal ganti implementasi fungsi-fungsi di atas dengan fetch/axios:

// Contoh migrasi ke backend:

export const getMateriList = async () => {
  try {
    const response = await fetch('http://api.example.com/materi');
    return await response.json();
  } catch (error) {
    console.error('Error getting materi:', error);
    return [];
  }
};

export const addMateri = async (materi) => {
  try {
    const response = await fetch('http://api.example.com/materi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materi)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding materi:', error);
    throw error;
  }
};

// Dan seterusnya untuk fungsi lainnya...
// Component TIDAK PERLU DIUBAH karena interface-nya sama!

*/

// ============= MATERI PROGRESS SERVICE =============

export const getMateriProgress = (userId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERI_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};
    return allProgress[userId] || {};
  } catch (error) {
    console.error('Error getting materi progress:', error);
    return {};
  }
};

export const updateMateriProgress = (userId, materiId, progressData) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERI_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};
    
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    allProgress[userId][materiId] = {
      ...progressData,
      lastAccessed: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.MATERI_PROGRESS, JSON.stringify(allProgress));
    return allProgress[userId][materiId];
  } catch (error) {
    console.error('Error updating materi progress:', error);
    throw error;
  }
};

export const markMateriAsCompleted = (userId, materiId) => {
  return updateMateriProgress(userId, materiId, {
    status: 'selesai',
    progress: 100,
    completedAt: new Date().toISOString()
  });
};

export const markMateriAsStarted = (userId, materiId) => {
  const currentProgress = getMateriProgress(userId)[materiId];
  if (!currentProgress || currentProgress.status === 'belum') {
    return updateMateriProgress(userId, materiId, {
      status: 'berjalan',
      progress: 50,
      startedAt: new Date().toISOString()
    });
  }
  return currentProgress;
};

// ============= PBL SERVICE =============

export const getPBLList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PBL);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting PBL:', error);
    return [];
  }
};

export const getPBLById = (id) => {
  try {
    const pblList = getPBLList();
    return pblList.find(p => p.id === parseInt(id));
  } catch (error) {
    console.error('Error getting PBL by id:', error);
    return null;
  }
};

export const addPBL = (pbl) => {
  try {
    const pblList = getPBLList();
    const newPBL = {
      ...pbl,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    pblList.push(newPBL);
    localStorage.setItem(STORAGE_KEYS.PBL, JSON.stringify(pblList));
    return newPBL;
  } catch (error) {
    console.error('Error adding PBL:', error);
    throw error;
  }
};

export const updatePBL = (id, updatedData) => {
  try {
    const pblList = getPBLList();
    const index = pblList.findIndex(p => p.id === id);
    if (index !== -1) {
      pblList[index] = { ...pblList[index], ...updatedData };
      localStorage.setItem(STORAGE_KEYS.PBL, JSON.stringify(pblList));
      return pblList[index];
    }
    throw new Error('PBL not found');
  } catch (error) {
    console.error('Error updating PBL:', error);
    throw error;
  }
};

export const deletePBL = (id) => {
  try {
    const pblList = getPBLList();
    const filtered = pblList.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PBL, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting PBL:', error);
    throw error;
  }
};

// ============= PBL PROGRESS SERVICE =============

export const getPBLProgress = (userId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PBL_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};
    return allProgress[userId] || {};
  } catch (error) {
    console.error('Error getting PBL progress:', error);
    return {};
  }
};

export const updatePBLProgress = (userId, pblId, progressData) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PBL_PROGRESS);
    const allProgress = data ? JSON.parse(data) : {};
    
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    allProgress[userId][pblId] = {
      ...allProgress[userId][pblId],
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PBL_PROGRESS, JSON.stringify(allProgress));
    return allProgress[userId][pblId];
  } catch (error) {
    console.error('Error updating PBL progress:', error);
    throw error;
  }
};

export const submitPBLTahap = (userId, pblId, sintaksNomor, tahapNomor, jawaban, files = []) => {
  try {
    const currentProgress = getPBLProgress(userId)[pblId] || {
      currentSintaks: 1,
      currentTahap: 1,
      progress: 0,
      status: 'sedang',
      submissions: {}
    };
    
    const submissionKey = `${sintaksNomor}-${tahapNomor}`;
    currentProgress.submissions[submissionKey] = {
      jawaban,
      files,
      submittedAt: new Date().toISOString()
    };
    
    return updatePBLProgress(userId, pblId, currentProgress);
  } catch (error) {
    console.error('Error submitting PBL tahap:', error);
    throw error;
  }
};

export const unlockNextTahap = (userId, pblId, nextSintaks, nextTahap, totalProgress) => {
  try {
    return updatePBLProgress(userId, pblId, {
      currentSintaks: nextSintaks,
      currentTahap: nextTahap,
      progress: totalProgress
    });
  } catch (error) {
    console.error('Error unlocking next tahap:', error);
    throw error;
  }
};

// ============= SISWA SERVICE =============

export const getSiswaList = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SISWA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting siswa:', error);
    return [];
  }
};

export const getSiswaByKelas = (kelas) => {
  try {
    const siswaList = getSiswaList();
    return kelas ? siswaList.filter(s => s.kelas === kelas) : siswaList;
  } catch (error) {
    console.error('Error getting siswa by kelas:', error);
    return [];
  }
};

export const getSiswaById = (id) => {
  try {
    const siswaList = getSiswaList();
    return siswaList.find(s => s.id === id);
  } catch (error) {
    console.error('Error getting siswa by id:', error);
    return null;
  }
};

export const addSiswa = (siswa) => {
  try {
    const siswaList = getSiswaList();
    
    // Check duplicate NIS
    if (siswaList.some(s => s.nis === siswa.nis)) {
      throw new Error('NIS sudah terdaftar');
    }
    
    // Check duplicate email
    if (siswaList.some(s => s.email === siswa.email)) {
      throw new Error('Email sudah terdaftar');
    }
    
    const newSiswa = {
      ...siswa,
      id: `siswa_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    siswaList.push(newSiswa);
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(siswaList));
    return newSiswa;
  } catch (error) {
    console.error('Error adding siswa:', error);
    throw error;
  }
};

export const updateSiswa = (id, updatedData) => {
  try {
    const siswaList = getSiswaList();
    const index = siswaList.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Siswa tidak ditemukan');
    }
    
    // Check duplicate NIS (exclude current siswa)
    if (updatedData.nis && siswaList.some((s, idx) => s.nis === updatedData.nis && idx !== index)) {
      throw new Error('NIS sudah terdaftar');
    }
    
    // Check duplicate email (exclude current siswa)
    if (updatedData.email && siswaList.some((s, idx) => s.email === updatedData.email && idx !== index)) {
      throw new Error('Email sudah terdaftar');
    }
    
    siswaList[index] = { 
      ...siswaList[index], 
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(siswaList));
    return siswaList[index];
  } catch (error) {
    console.error('Error updating siswa:', error);
    throw error;
  }
};

export const deleteSiswa = (id) => {
  try {
    const siswaList = getSiswaList();
    const filtered = siswaList.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting siswa:', error);
    throw error;
  }
};

export const getKelasList = () => {
  try {
    const siswaList = getSiswaList();
    const kelasSet = new Set(siswaList.map(s => s.kelas).filter(Boolean));
    return Array.from(kelasSet).sort();
  } catch (error) {
    console.error('Error getting kelas list:', error);
    return [];
  }
};
