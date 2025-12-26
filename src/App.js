import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import TentangKami from './pages/TentangKami';
import AdminDashboard from './pages/Dashboard/Admin';
import GuruDashboard from './pages/Dashboard/Guru';
import SiswaDashboard from './pages/Dashboard/Siswa';
import SiswaMateri from './pages/Siswa/Materi';
import DetailMateri from './pages/Siswa/Materi/DetailMateri';
import SiswaKuis from './pages/Siswa/Kuis';
import KerjakanKuis from './pages/Siswa/Kuis/KerjakanKuis';
import GuruMateri from './pages/Guru/Materi';
import GuruKuis from './pages/Guru/Kuis';
import KelolaSoal from './pages/Guru/Kuis/KelolaSoal';
import GuruPBL from './pages/Guru/PBL';
import SiswaPBL from './pages/Siswa/PBL';
import KerjakanPBL from './pages/Siswa/PBL/KerjakanPBL';
import SiswaNilai from './pages/Siswa/Nilai';
import GuruNilaiSiswa from './pages/Guru/NilaiSiswa';
import GuruSiswa from './pages/Guru/Siswa';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            
            <Route path="/tentang-kami" element={
              <>
                <Navbar />
                <TentangKami />
                <Footer />
              </>
            } />
            
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />


            <Route path="/guru/dashboard" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruDashboard />
              </ProtectedRoute>
            } />

            <Route path="/guru/materi" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruMateri />
              </ProtectedRoute>
            } />

            <Route path="/guru/kuis" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruKuis />
              </ProtectedRoute>
            } />

            <Route path="/guru/kuis/:kuisId/soal" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <KelolaSoal />
              </ProtectedRoute>
            } />

            <Route path="/guru/pbl" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruPBL />
              </ProtectedRoute>
            } />

            <Route path="/guru/nilai-siswa" element={
              <ProtectedRoute allowedRoles={['guru']}>
                <GuruNilaiSiswa />
              </ProtectedRoute>
            } />

            {/* Data Siswa routes sementara dinonaktifkan */}

            <Route path="/siswa/dashboard" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaDashboard />
              </ProtectedRoute>
            } />

            <Route path="/siswa/materi" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaMateri />
              </ProtectedRoute>
            } />

            <Route path="/siswa/materi/:materiId" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <DetailMateri />
              </ProtectedRoute>
            } />

            <Route path="/siswa/kuis" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaKuis />
              </ProtectedRoute>
            } />

            <Route path="/siswa/kuis/:kuisId/mulai" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <KerjakanKuis />
              </ProtectedRoute>
            } />

            <Route path="/siswa/pbl" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaPBL />
              </ProtectedRoute>
            } />

            <Route path="/siswa/pbl/:pblId/kerjakan" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <KerjakanPBL />
              </ProtectedRoute>
            } />

            <Route path="/siswa/nilai" element={
              <ProtectedRoute allowedRoles={['siswa']}>
                <SiswaNilai />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
