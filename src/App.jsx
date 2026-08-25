import React, { useState, useEffect } from 'react';
import { 
  Building2, FileText, CheckCircle2, Clock, AlertCircle, 
  User, Lock, Mail, Phone, LogOut, Upload, Eye, Download, 
  Trash2, X, Check, ArrowRight, ShieldCheck, HelpCircle, FileCheck, Calendar, RefreshCw
} from 'lucide-react';

export default function App() {
  // Navigation & Auth State
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'user-dashboard', 'admin-dashboard'
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [currentUser, setCurrentUser] = useState(null);

  // Form Inputs - Login
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form Inputs - Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regClinicName, setRegClinicName] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Users Database in LocalStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('siperklin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'u1',
        name: 'Dr. Made Surya, M.Kes',
        email: 'surya@kliniksehat.com',
        phone: '081234567890',
        password: 'password123',
        clinicName: 'Klinik Pratama Sehat Mandiri',
        status: 'Sedang Diperiksa',
        submissionDate: '2026-08-20',
        documents: {
          suratPermohonan: { name: 'Surat_Permohonan_SehatMandiri.pdf', status: 'Sudah Terverifikasi', note: 'Dokumen lengkap sesuai ketentuan.' },
          profilKlinik: { name: 'Profil_Klinik_Pratama.pdf', status: 'Catatan Perbaikan', note: 'Mohon lampirkan denah ruangan secara lebih detail.' },
          suratIzinPraktik: { name: 'SIP_Dokter_PenanggungJawab.pdf', status: 'Sudah Terverifikasi', note: '' },
          suratKelayakan: { name: 'Sertifikat_Kelayakan_Alat.pdf', status: 'Menunggu Verifikasi', note: '' }
        }
      },
      {
        id: 'u2',
        name: 'Dr. Ni Luh Putu Ari',
        email: 'ari@klinikbali.com',
        phone: '081987654321',
        password: 'password123',
        clinicName: 'Klinik Utama Bali Medika',
        status: 'Sudah Terverifikasi',
        submissionDate: '2026-08-18',
        documents: {
          suratPermohonan: { name: 'Surat_Permohonan_BaliMedika.pdf', status: 'Sudah Terverifikasi', note: 'Sangat baik.' },
          profilKlinik: { name: 'Profil_Lengkap_Klinik.pdf', status: 'Sudah Terverifikasi', note: '' },
          suratIzinPraktik: { name: 'Daftar_SDM_Klinik.pdf', status: 'Sudah Terverifikasi', note: '' },
          suratKelayakan: { name: 'Kelayakan_Gedung_Medika.pdf', status: 'Sudah Terverifikasi', note: '' }
        }
      }
    ];
  });

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem('siperklin_users', JSON.stringify(users));
  }, [users]);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);

  // Admin Active Tab / Filter
  const [adminTab, setAdminTab] = useState('pengajuan'); // 'pengajuan'

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Check Admin Credentials
    if ((loginInput.trim() === 'yankesbadung' || loginInput.trim() === 'yankesbadung@badungkab.go.id') && loginPassword === 'Pelayanankesehatan1') {
      const adminUser = { role: 'admin', name: 'Administrator Bidang Yankes', email: 'yankesbadung' };
      setCurrentUser(adminUser);
      setCurrentView('admin-dashboard');
      return;
    }

    // Check Registered Users
    const foundUser = users.find(
      u => (u.email === loginInput.trim() || u.name.toLowerCase() === loginInput.trim().toLowerCase() || u.phone === loginInput.trim()) && u.password === loginPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setCurrentView('user-dashboard');
    } else {
      setLoginError('Username/Email/No. Telp atau Password salah, atau akun belum terdaftar.');
    }
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setRegSuccess('');

    if (!regName || !regEmail || !regPhone || !regPassword || !regClinicName) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    // Check if email exists
    if (users.some(u => u.email === regEmail)) {
      alert('Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
      return;
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      clinicName: regClinicName,
      status: 'Menunggu Verifikasi',
      submissionDate: new Date().toISOString().split('T')[0],
      documents: {
        suratPermohonan: { name: 'Surat_Permohonan_Resmi.pdf', status: 'Menunggu Verifikasi', note: '' },
        profilKlinik: { name: 'Profil_Klinik.pdf', status: 'Menunggu Verifikasi', note: '' },
        suratIzinPraktik: { name: 'Daftar_Tenaga_Medis.pdf', status: 'Menunggu Verifikasi', note: '' },
        suratKelayakan: { name: 'Surat_Kelayakan_Lokasi.pdf', status: 'Menunggu Verifikasi', note: '' }
      }
    };

    setUsers([...users, newUser]);
    setRegSuccess('Pendaftaran berhasil! Silakan masuk menggunakan akun yang telah didaftarkan.');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegClinicName('');
    setTimeout(() => {
      setAuthTab('login');
      setRegSuccess('');
    }, 2000);
  };

  // Handle User Document Upload Simulation
  const handleUploadDoc = (docKey, fileName) => {
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        const updatedDocs = {
          ...u.documents,
          [docKey]: { name: fileName, status: 'Menunggu Verifikasi', note: '' }
        };
        const updatedUser = { ...u, documents: updatedDocs, status: 'Sedang Diperiksa' };
        return updatedUser;
      }
      return u;
    });
    setUsers(updatedUsers);
    const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updatedCurrent);
    alert('Dokumen berhasil diunggah dan dikirim ke Admin!');
  };

  // Admin: Update Document Status
  const handleAdminUpdateDocStatus = (userId, docKey, newStatus, newNote) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const updatedDocs = {
          ...u.documents,
          [docKey]: { ...u.documents[docKey], status: newStatus, note: newNote }
        };
        
        // Re-evaluate overall clinic status
        const statuses = Object.values(updatedDocs).map(d => d.status);
        let overallStatus = 'Sedang Diperiksa';
        if (statuses.every(s => s === 'Sudah Terverifikasi')) {
          overallStatus = 'Sudah Terverifikasi';
        } else if (statuses.some(s => s === 'Catatan Perbaikan')) {
          overallStatus = 'Catatan Perbaikan';
        }

        return { ...u, documents: updatedDocs, status: overallStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  // Admin: Delete User
  const handleDeleteUser = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pemohon/klinik ini beserta seluruh dokumennya?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
    }
  };

  // Statistics for Admin
  const totalPengajuan = users.length;
  const sedangDiperiksaCount = users.filter(u => u.status === 'Sedang Diperiksa' || u.status === 'Menunggu Verifikasi' || u.status === 'Catatan Perbaikan').length;
  const sudahTerverifikasiCount = users.filter(u => u.status === 'Sudah Terverifikasi').length;
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-800 flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { if(!currentUser) setCurrentView('login'); }}>
            <div className="w-11 h-11 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-emerald-900 tracking-tight">SIPERKLIN</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">v2.1</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Sistem Informasi Pendaftaran Rekomendasi Klinik Terpadu</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-xs text-emerald-600 font-medium">{currentUser.role === 'admin' ? 'Administrator Bidang Yankes' : currentUser.clinicName}</p>
              </div>
              <button 
                onClick={() => { setCurrentUser(null); setCurrentView('login'); setLoginInput(''); setLoginPassword(''); }}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition border border-red-200">
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bidang Pelayanan Kesehatan Dinas Kesehatan Kabupaten Badung</span>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1 & 2: LOGIN / REGISTER */}
        {currentView === 'login' && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-emerald-100">
            
            {/* Left Brand Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">SIPERKLIN BADUNG</h1>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  Satu portal terpadu untuk pengurusan kelayakan administrasi rekomendasi operasional klinik tingkat Pratama maupun Utama di Kabupaten Badung.
                </p>
              </div>
              <div className="pt-6 border-t border-emerald-700/60 text-xs text-emerald-200">
                Bidang Pelayanan Kesehatan Dinas Kesehatan Kabupaten Badung
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              
              {/* Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 max-w-sm">
                <button 
                  onClick={() => { setAuthTab('login'); setRegSuccess(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 ${authTab === 'login' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                  <Lock className="w-4 h-4" />
                  <span>Masuk Akun</span>
                </button>
                <button 
                  onClick={() => { setAuthTab('register'); setLoginError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 ${authTab === 'register' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                  <User className="w-4 h-4" />
                  <span>Pendaftaran Baru</span>
                </button>
              </div>

              {/* LOGIN FORM */}
              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang Kembali</h2>
                    <p className="text-xs text-gray-500">Masukkan username/email/no. telp dan password untuk mengakses rekomendasi.</p>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Username / Email / No. Telp</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        required
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="contoh: yankesbadung, 081234567890 atau email"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi administrator Dinkes Badung untuk reset password.'); }} className="text-xs text-emerald-600 hover:underline font-medium">Lupa Password?</a>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type="password" 
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2">
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                    <p className="font-bold mb-1">💡 Informasi Login:</p>
                    <p>• <strong>Admin:</strong> username <code className="bg-white px-1 py-0.5 rounded font-bold text-emerald-700">yankesbadung</code> | password <code className="bg-white px-1 py-0.5 rounded font-bold text-emerald-700">Pelayanankesehatan1</code></p>
                    <p className="mt-1">• <strong>User Pemohon:</strong> Wajib mendaftar terlebih dahulu menggunakan tab "Pendaftaran Baru" di atas.</p>
                  </div>
                </form>
              )}

              {/* REGISTER FORM */}
              {authTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Pendaftaran Akun Klinik</h2>
                    <p className="text-xs text-gray-500">Lengkapi formulir di bawah untuk mengajukan permohonan rekomendasi klinik.</p>
                  </div>

                  {regSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Pemohon / Penanggung Jawab</label>
                      <input 
                        type="text" 
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Dr. Nama Lengkap & Gelar"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Klinik</label>
                      <input 
                        type="text" 
                        required
                        value={regClinicName}
                        onChange={(e) => setRegClinicName(e.target.value)}
                        placeholder="Klinik Pratama / Utama ..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Aktif</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="email" 
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="email@klinik.com"
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nomor Telp / WhatsApp</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type="text" 
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password Akun</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="password" 
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 mt-2">
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* VIEW 3: USER DASHBOARD */}
        {currentView === 'user-dashboard' && currentUser && currentUser.role !== 'admin' && (
          <div className="w-full max-w-6xl space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-700 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600">Dashboard Pemohon</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{currentUser.clinicName}</h1>
                <p className="text-emerald-100 text-sm mt-1">Penanggung Jawab: {currentUser.name} | WhatsApp: {currentUser.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center space-x-3">
                <div>
                  <p className="text-xs text-emerald-200 font-medium">Status Pengajuan</p>
                  <p className="text-sm font-bold flex items-center space-x-1.5 mt-0.5">
                    {currentUser.status === 'Sudah Terverifikasi' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                    {currentUser.status === 'Sedang Diperiksa' && <Clock className="w-4 h-4 text-amber-300" />}
                    {currentUser.status === 'Catatan Perbaikan' && <AlertCircle className="w-4 h-4 text-red-300" />}
                    <span>{currentUser.status}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Document Upload Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Unggah Berkas Persyaratan Rekomendasi Klinik</h2>
                  <p className="text-xs text-gray-500">Unggah file berformat PDF (Maks 10MB) untuk diverifikasi oleh Tim Dinas Kesehatan Badung.</p>
                </div>
                <button 
                  onClick={() => {
                    const fresh = users.find(u => u.id === currentUser.id);
                    setCurrentUser(fresh);
                    alert('Data diperbarui!');
                  }}
                  className="flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-xl font-semibold transition border border-emerald-200">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Perbarui Status</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'suratPermohonan', title: '1. Surat Permohonan Resmi', desc: 'Surat permohonan rekomendasi bermaterai' },
                  { key: 'profilKlinik', title: '2. Profil & Denah Klinik', desc: 'Struktur organisasi & denah ruangan klinik' },
                  { key: 'suratIzinPraktik', title: '3. SIP & Daftar Tenaga Medis', desc: 'Surat Izin Praktik dokter & nakes terkait' },
                  { key: 'suratKelayakan', title: '4. Sertifikat Kelayakan Alat & Gedung', desc: 'Hasil uji kelayakan alat kesehatan & bangunan' },
                ].map((item) => {
                  const docInfo = currentUser.documents[item.key] || { name: 'Belum diunggah', status: 'Belum Ada', note: '' };
                  return (
                    <div key={item.key} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-300 transition">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            docInfo.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                            docInfo.status === 'Catatan Perbaikan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {docInfo.status}
                          </span>
                        </div>

                        <div className="my-3 py-2 px-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium truncate">{docInfo.name}</span>
                          </div>
                          {docInfo.name !== 'Belum diunggah' && (
                            <button 
                              onClick={() => setPreviewDoc({ title: item.title, name: docInfo.name, status: docInfo.status, note: docInfo.note })}
                              className="text-xs text-emerald-700 hover:underline font-bold flex items-center space-x-1 flex-shrink-0 ml-2">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat</span>
                            </button>
                          )}
                        </div>

                        {docInfo.note && (
                          <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
                            <span className="font-bold">Catatan Admin:</span> {docInfo.note}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                        <label className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-4 rounded-xl transition shadow-sm flex items-center space-x-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{docInfo.name === 'Belum diunggah' ? 'Unggah Berkas' : 'Ganti Berkas'}</span>
                          <input 
                            type="file" 
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleUploadDoc(item.key, e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">Format PDF (Max 10MB)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && currentUser && currentUser.role === 'admin' && (
          <div className="w-full max-w-7xl space-y-6">
            
            {/* Admin Header Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700">Panel Administrator</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Manajemen & Verifikasi Pengajuan Klinik</h1>
                <p className="text-gray-300 text-xs mt-1">Dinas Kesehatan Kabupaten Badung • {currentDateFormatted}</p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {totalPengajuan}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah Pengajuan</p>
                  <p className="text-xl font-extrabold text-gray-900">{totalPengajuan} Klinik</p>
                  <p className="text-[11px] text-gray-500">{currentDateFormatted}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {sedangDiperiksaCount}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sedang Diperiksa</p>
                  <p className="text-xl font-extrabold text-amber-700">{sedangDiperiksaCount} Klinik</p>
                  <p className="text-[11px] text-gray-500">Perlu Verifikasi / Perbaikan</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {sudahTerverifikasiCount}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sudah Terverifikasi</p>
                  <p className="text-xl font-extrabold text-teal-700">{sudahTerverifikasiCount} Klinik</p>
                  <p className="text-[11px] text-gray-500">Rekomendasi Siap Terbit</p>
                </div>
              </div>
            </div>

            {/* Applicants List & Review Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Dokumen Pemohon Klinik</h2>
                  <p className="text-xs text-gray-500">Kelola status verifikasi berkas dan berikan catatan perbaikan untuk setiap pemohon.</p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Total: {users.length} Pemohon
                </span>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-700">Belum ada pemohon klinik yang terdaftar.</p>
                  <p className="text-xs text-gray-500 mt-1">Pemohon dapat melakukan pendaftaran baru melalui halaman utama.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {users.map((u) => (
                    <div key={u.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 gap-3">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-extrabold text-gray-900 text-base">{u.clinicName}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              u.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                              u.status === 'Catatan Perbaikan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Penanggung Jawab: <span className="font-medium text-gray-800">{u.name}</span> | Email: <span className="font-medium text-gray-800">{u.email}</span> | WA: <span className="font-medium text-gray-800">{u.phone}</span> | Tanggal Pengajuan: <span className="font-medium text-gray-800">{u.submissionDate}</span>
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-red-200 flex items-center space-x-1">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Pemohon</span>
                        </button>
                      </div>

                      {/* DOCUMENT PREVIEW MODAL */}
                      {previewDoc && (...))
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                              <div>
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Pratinjau Dokumen Persyaratan</span>
                                <h3 className="text-lg font-extrabold text-gray-900 mt-1">{previewDoc.title}</h3>
                                {previewDoc.clinic && <p className="text-xs text-gray-500">Klinik: {previewDoc.clinic}</p>}
                              </div>
                              <button 
                                onClick={() => setPreviewDoc(...)}
                                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 transition">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                
                            <div className="space-y-4">
                              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{previewDoc.name}</p>
                                    <p className="text-xs text-emerald-700 font-medium">Status: {previewDoc.status}</p>
                                  </div>
                                </div>
                                <a 
                                  href={`#download-${previewDoc.name}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Membuat simulasi unduh atau membuka file PDF
                                    alert(`Membuka dokumen PDF: ${previewDoc.name}`);
                                  }}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm">
                                  <Download className="w-4 h-4" />
                                  <span>Buka / Unduh PDF</span>
                                </a>
                              </div>
                
                              {/* Kotak Informasi & Simulasi Tampilan Dokumen Asli */}
                              <div className="bg-emerald-900/10 border border-emerald-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3">
                                <FileCheck className="w-12 h-12 text-emerald-700" />
                                <p className="text-sm font-bold text-gray-900">Berkas PDF: {previewDoc.name}</p>
                                <p className="text-xs text-gray-600 max-w-md">
                                  File dokumen persyaratan ini dikirim langsung oleh pemohon klinik dan siap untuk divalidasi keasliannya oleh tim verifikator Dinas Kesehatan.
                                </p>
                              </div>
                
                              {previewDoc.note && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
                                  <span className="font-bold">Catatan Perbaikan:</span> {previewDoc.note}
                                </div>
                              )}
                            </div>
                
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                              <button 
                                onClick={() => setPreviewDoc(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition">
                                Tutup Pratinjau
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                              {/* Status changer & Note input */}
                              <div className="space-y-2 pt-2 border-t border-gray-100">
                                <select 
                                  value={docVal.status}
                                  onChange={(e) => handleAdminUpdateDocStatus(u.id, docKey, e.target.value, docVal.note)}
                                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                  <option value="Sudah Terverifikasi">Sudah Terverifikasi</option>
                                  <option value="Catatan Perbaikan">Catatan Perbaikan</option>
                                </select>

                                <input 
                                  type="text"
                                  placeholder="Catatan perbaikan..."
                                  value={docVal.note}
                                  onChange={(e) => handleAdminUpdateDocStatus(u.id, docKey, docVal.status, e.target.value)}
                                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Pratinjau Dokumen Persyaratan</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-1">{previewDoc.title}</h3>
                {previewDoc.clinic && <p className="text-xs text-gray-500">Klinik: {previewDoc.clinic}</p>}
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{previewDoc.name}</p>
                    <p className="text-xs text-emerald-700 font-medium">Status: {previewDoc.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Mengunduh file: ${previewDoc.name}`)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm">
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF</span>
                </button>
              </div>

              {/* Simulated PDF Viewer Box */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white text-center h-64 flex flex-col items-center justify-center space-y-3 relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <FileCheck className="w-12 h-12 text-emerald-400" />
                <p className="text-sm font-semibold tracking-wide">Pratinjau Berkas Dokumen Resmi Klinik</p>
                <p className="text-xs text-gray-400 max-w-md">
                  Dokumen ini telah diunggah oleh pemohon dan terenkripsi aman dalam sistem penyimpanan SIPERKLIN Badung.
                </p>
              </div>

              {previewDoc.note && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
                  <span className="font-bold">Catatan Perbaikan:</span> {previewDoc.note}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition">
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-emerald-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Dinas Kesehatan Kabupaten Badung. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-emerald-700 transition cursor-pointer" onClick={() => alert('Sistem Informasi Pendaftaran Rekomendasi Klinik Terpadu v2.1')}>Bantuan & Panduan</span>
            <span className="hover:text-emerald-700 transition cursor-pointer" onClick={() => alert('Kontak: yankes.badungkab@gov.id')}>Kontak Bidang Yankes</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
