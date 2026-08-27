import React, { useState, useEffect } from 'react';
import { 
  Building2, FileText, CheckCircle2, Clock, AlertCircle, 
  User, Lock, Mail, Phone, LogOut, Upload, Eye, Download, 
  Trash2, X, ArrowRight, ShieldCheck, FileCheck, RefreshCw 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi koneksi Supabase menggunakan Environment Variables Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const LIST_28_DOKUMEN = [
  { key: 'dok_1', title: '1. Surat Permohonan Izin Operasional', desc: 'Surat permohonan resmi bermaterai' },
  { key: 'dok_2', title: '2. Profil Lengkap Klinik', desc: 'Visi, misi, struktur organisasi, & layanan' },
  { key: 'dok_3', title: '3. Akta Pendirian Badan Hukum/Usaha', desc: 'Akta notaris pendirian yayasan/PT/CV' },
  { key: 'dok_4', title: '4. Pengesahan Badan Hukum dari Kemenkumham', desc: 'Surat keputusan pengesahan resmi' },
  { key: 'dok_5', title: '5. Bukti Kepemilikan / Penguasaan Tanah & Gedung', desc: 'Sertifikat tanah / Akta sewa bangunan minimal 5 tahun' },
  { key: 'dok_6', title: '6. Izin Mendirikan Bangunan (IMB) / PBG', desc: 'Persetujuan Bangunan Gedung sesuai peruntukan' },
  { key: 'dok_7', title: '7. Surat Layanan / Kelaikan Fungsi Gedung (SLF)', desc: 'Sertifikat kelaikan fungsi bangunan' },
  { key: 'dok_8', title: '8. Surat Izin Praktik (SIP) Dokter Penanggung Jawab', desc: 'SIP dokter penanggung jawab klinik' },
  { key: 'dok_9', title: '9. Daftar Seluruh Tenaga Medis & Paramedis', desc: 'Daftar nama lengkap beserta kualifikasi' },
  { key: 'dok_10', title: '10. Salinan SIP Dokter & Tenaga Kesehatan Lainnya', desc: 'Kumpulan SIP seluruh nakes yang bertugas' },
  { key: 'dok_11', title: '11. Surat Perjanjian Kerja Sama (PKS) Tenaga Medis', desc: 'Kontrak kerja tenaga kesehatan' },
  { key: 'dok_12', title: '12. Surat Pernyataan Sanggup Mematuhi Peraturan', desc: 'Surat pernyataan bermaterai' },
  { key: 'dok_13', title: '13. Denah Ruangan / Layout Klinik (Blueprint)', desc: 'Denah bangunan ukuran jelas per ruangan' },
  { key: 'dok_14', title: '14. Dokumen Upaya Pengelolaan & Pemantauan Lingkungan', desc: 'Izin lingkungan hidup (UKL-UPL/SPPL)' },
  { key: 'dok_15', title: '15. Kerjasama Pengolahan Limbah Medis B3', desc: 'PKS pihak ketiga pengangkut limbah medis B3' },
  { key: 'dok_16', title: '16. Manifest Pengolahan Limbah B3 Bulanan', desc: 'Bukti pengelolaan limbah medis' },
  { key: 'dok_17', title: '17. Daftar Inventaris Alat Kesehatan (Alkes)', desc: 'Daftar lengkap alkes utama & pendukung' },
  { key: 'dok_18', title: '18. Sertifikat Kalibrasi Alat Kesehatan', desc: 'Bukti kalibrasi alkes yang masih berlaku' },
  { key: 'dok_19', title: '19. SOP Pelayanan Medis & Keperawatan', desc: 'Standar Operasional Prosedur pelayanan klinik' },
  { key: 'dok_20', title: '20. SOP Pencegahan & Pengendalian Infeksi (PPI)', desc: 'Prosedur pencegahan infeksi nosokomial' },
  { key: 'dok_21', title: '21. SOP Penanganan Kegawatdaruratan (Emergency)', desc: 'Prosedur rujukan & gawat darurat' },
  { key: 'dok_22', title: '22. Dokumen Formularium Obat & Alkes', desc: 'Daftar sediaan obat yang disediakan di klinik' },
  { key: 'dok_23', title: '23. Surat Izin Apotek (SIA) / Ruang Farmasi', desc: 'Perizinan pengelolaan obat' },
  { key: 'dok_24', title: '24. Surat Penunjukan Apoteker Penanggung Jawab', desc: 'SIPA Apoteker yang bertugas' },
  { key: 'dok_25', title: '25. Sistem Rekam Medis (Manual / Elektronik)', desc: 'Kebijakan & SOP pengelolaan rekam medis pasien' },
  { key: 'dok_26', title: '26. Bukti Kerjasama Rujukan (MoU RS Rujukan)', desc: 'MoU dengan Rumah Sakit terdekat' },
  { key: 'dok_27', title: '27. Pas Foto & KTP Penanggung Jawab Klinik', desc: 'Identitas resmi pimpinan / penanggung jawab' },
  { key: 'dok_28', title: '28. Surat Rekomendasi Organisasi Profesi (IDI)', desc: 'Rekomendasi IDI / asosiasi fasyankes setempat' },
];

const generateInitialDocuments = () => {
  const docs = {};
  LIST_28_DOKUMEN.forEach((item, index) => {
    docs[item.key] = {
      name: index === 0 ? 'Surat_Permohonan_Operasional.pdf' : 'Belum diunggah',
      url: '',
      status: index === 0 ? 'Sudah Terverifikasi' : 'Menunggu Verifikasi',
      note: ''
    };
  });
  return docs;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('siperklin_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('siperklin_current_user');
    if (!savedUser) return 'login';
    const parsed = JSON.parse(savedUser);
    return parsed.role === 'admin' ? 'admin-dashboard' : 'user-dashboard';
  });

  const [authTab, setAuthTab] = useState('login');
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regClinicName, setRegClinicName] = useState('');
  const [regClinicType, setRegClinicType] = useState('Klinik Pratama');
  const [regSuccess, setRegSuccess] = useState('');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('SIPERKLIN').select('*');
        if (data && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            clinicName: item.clinic_name,
            clinicType: item.clinic_type || 'Klinik Pratama',
            password: item.password,
            status: item.status,
            documents: item.documents || generateInitialDocuments(),
            visitRevision: item.visit_revision || { name: 'Belum diunggah', url: '', note: '' }
          }));
          setUsers(formatted);

          if (currentUser && currentUser.role !== 'admin') {
            const latestSelf = formatted.find(u => u.id === currentUser.id);
            if (latestSelf) {
              setCurrentUser(latestSelf);
              localStorage.setItem('siperklin_current_user', JSON.stringify(latestSelf));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    }
    fetchProfiles();
  }, []);

  const [previewDoc, setPreviewDoc] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if ((loginInput.trim() === 'yankesbadung' || loginInput.trim() === 'yankesbadung@badungkab.go.id') && loginPassword === 'Pelayanankesehatan1') {
      const adminData = { role: 'admin', name: 'Administrator Bidang Yankes', email: 'yankesbadung' };
      setCurrentUser(adminData);
      setCurrentView('admin-dashboard');
      localStorage.setItem('siperklin_current_user', JSON.stringify(adminData));
      return;
    }

    const foundUser = users.find(
      u => (u.email === loginInput.trim() || u.name.toLowerCase() === loginInput.trim().toLowerCase() || u.phone === loginInput.trim()) && u.password === loginPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setCurrentView('user-dashboard');
      localStorage.setItem('siperklin_current_user', JSON.stringify(foundUser));
    } else {
      setLoginError('Username/Email/No. Telp atau Password salah, atau akun belum terdaftar.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    localStorage.removeItem('siperklin_current_user');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegSuccess('');

    if (!regName || !regEmail || !regPhone || !regPassword || !regClinicName || !regClinicType) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    if (users.some(u => u.email === regEmail)) {
      alert('Email sudah terdaftar. Silakan gunakan email lain.');
      return;
    }

    const newId = 'u_' + Date.now();
    const newUser = {
      id: newId,
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      clinicName: regClinicName,
      clinicType: regClinicType,
      status: 'Menunggu Verifikasi',
      submissionDate: new Date().toISOString().split('T')[0],
      documents: generateInitialDocuments(),
      visitRevision: { name: 'Belum diunggah', url: '', note: '' }
    };

    if (supabase) {
      const { error } = await supabase.from('SIPERKLIN').insert([
        {
          id: newId,
          name: regName,
          email: regEmail,
          phone: regPhone,
          clinic_name: regClinicName,
          clinic_type: regClinicType,
          password: regPassword,
          status: 'Menunggu Verifikasi',
          documents: newUser.documents,
          visit_revision: newUser.visitRevision
        }
      ]);
      if (error) {
        alert('Gagal menyimpan ke database cloud: ' + error.message);
        return;
      }
    }

    setUsers([...users, newUser]);
    setRegSuccess('Pendaftaran berhasil! Silakan masuk.');
    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegClinicName(''); setRegClinicType('Klinik Pratama');
    setTimeout(() => { setAuthTab('login'); setRegSuccess(''); }, 2000);
  };

  const handleUploadDoc = async (docKey, file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Url = reader.result;

      const updatedDocs = {
        ...currentUser.documents,
        [docKey]: { 
          name: file.name, 
          url: base64Url, 
          status: 'Menunggu Verifikasi', 
          note: '' 
        }
      };

      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, documents: updatedDocs, status: 'Sedang Diperiksa' };
        }
        return u;
      });

      setUsers(updatedUsers);
      const updatedSelf = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedSelf);
      localStorage.setItem('siperklin_current_user', JSON.stringify(updatedSelf));

      if (supabase) {
        const { error } = await supabase.from('SIPERKLIN').update({
          documents: updatedDocs,
          status: 'Sedang Diperiksa'
        }).eq('id', currentUser.id);

        if (error) {
          alert('Gagal menyinkronkan dokumen: ' + error.message);
          return;
        }
      }

      alert('Dokumen PDF berhasil diunggah!');
    };
  };

  const handleUploadVisitRevision = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Url = reader.result;
      const revisionData = {
        name: file.name,
        url: base64Url,
        status: 'Menunggu Verifikasi Visitasi',
        note: ''
      };

      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, visitRevision: revisionData, status: 'Menunggu Verifikasi Visitasi' };
        }
        return u;
      });

      setUsers(updatedUsers);
      const updatedSelf = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedSelf);
      localStorage.setItem('siperklin_current_user', JSON.stringify(updatedSelf));

      if (supabase) {
        const { error } = await supabase.from('SIPERKLIN').update({
          visit_revision: revisionData,
          status: 'Menunggu Verifikasi Visitasi'
        }).eq('id', currentUser.id);

        if (error) {
          alert('Gagal mengunggah berkas perbaikan visitasi: ' + error.message);
          return;
        }
      }

      alert('Berkas perbaikan setelah visitasi berhasil diunggah!');
    };
  };

  const handleAdminUpdateDocStatus = async (userId, docKey, newStatus, newNote) => {
    let targetUser = null;
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const updatedDocs = {
          ...u.documents,
          [docKey]: { ...u.documents[docKey], status: newStatus, note: newNote }
        };
        const statuses = Object.values(updatedDocs).map(d => d.status);
        let overallStatus = 'Sedang Diperiksa';
        if (statuses.every(s => s === 'Sudah Terverifikasi')) {
          overallStatus = 'Sudah Terverifikasi';
        } else if (statuses.some(s => s === 'Catatan Perbaikan')) {
          overallStatus = 'Catatan Perbaikan';
        }
        targetUser = { ...u, documents: updatedDocs, status: overallStatus };
        return targetUser;
      }
      return u;
    });

    setUsers(updatedUsers);

    if (supabase && targetUser) {
      await supabase.from('SIPERKLIN').update({
        documents: targetUser.documents,
        status: targetUser.status
      }).eq('id', userId);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Yakin ingin menghapus pemohon ini?')) {
      setUsers(users.filter(u => u.id !== userId));
      if (supabase) {
        await supabase.from('SIPERKLIN').delete().eq('id', userId);
      }
    }
  };

  const totalPengajuan = users.length;
  const sedangDiperiksaCount = users.filter(u => u.status !== 'Sudah Terverifikasi').length;
  const sudahTerverifikasiCount = users.filter(u => u.status === 'Sudah Terverifikasi').length;
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-800 flex flex-col justify-between">
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
                <p className="text-xs text-emerald-600 font-medium">{currentUser.role === 'admin' ? 'Administrator Bidang Yankes' : `${currentUser.clinicName} (${currentUser.clinicType})`}</p>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition border border-red-200">
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dinas Kesehatan Kabupaten Badung</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {!currentUser && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-emerald-100">
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-8 sm:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">SIPERKLIN BADUNG</h1>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  Portal pengurusan rekomendasi operasional klinik Pratama dan Utama dengan persyaratan lengkap 28 dokumen resmi.
                </p>
              </div>
              <div className="pt-6 border-t border-emerald-700/60 text-xs text-emerald-200">
                Bidang Pelayanan Kesehatan Dinas Kesehatan Kabupaten Badung
              </div>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 max-w-sm">
                <button onClick={() => setAuthTab('login')} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${authTab === 'login' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}>Masuk Akun</button>
                <button onClick={() => setAuthTab('register')} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${authTab === 'register' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}>Pendaftaran Baru</button>
              </div>

              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang Kembali</h2>
                  {loginError && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{loginError}</span></div>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Username / Email / No. Telp</label>
                    <input type="text" required value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="yankesbadung / 081234567890" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                    <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2">
                    <span>Masuk Sekarang</span><ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                    <p>• <strong>Admin:</strong> <code className="bg-white px-1 font-bold text-emerald-700">yankesbadung</code> | <code className="bg-white px-1 font-bold text-emerald-700">Pelayanankesehatan1</code></p>
                  </div>
                </form>
              )}

              {authTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Pendaftaran Akun Klinik</h2>
                  {regSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl"><span>{regSuccess}</span></div>}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Pemohon</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Dr. Nama & Gelar" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Klinik</label>
                      <input type="text" required value={regClinicName} onChange={(e) => setRegClinicName(e.target.value)} placeholder="Klinik Pratama ..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Jenis Klinik</label>
                    <select value={regClinicType} onChange={(e) => setRegClinicType(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <option value="Klinik Pratama">Klinik Pratama</option>
                      <option value="Klinik Utama">Klinik Utama</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                      <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email@klinik.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">No. WhatsApp</label>
                      <input type="text" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="081234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                    <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition">Daftar Sekarang</button>
                </form>
              )}
            </div>
          </div>
        )}

        {currentUser && currentUser.role !== 'admin' && (
          <div className="w-full max-w-6xl space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-700 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600">Dashboard Pemohon ({currentUser.clinicType})</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{currentUser.clinicName}</h1>
                <p className="text-emerald-100 text-sm mt-1">PJ: {currentUser.name} | WhatsApp: {currentUser.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                <p className="text-xs text-emerald-200 font-medium">Status Pengajuan</p>
                <p className="text-sm font-bold flex items-center space-x-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>{currentUser.status}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-amber-200 p-6 sm:p-8 bg-amber-50/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-amber-800 font-bold mb-1">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h2>Menu Perbaikan / Tindak Lanjut Setelah Visitasi Lapangan</h2>
                  </div>
                  <p className="text-xs text-gray-600">
                    Jika tim Dinas Kesehatan telah melakukan visitasi dan memberikan catatan perbaikan, silakan unggah dokumen/berkas perbaikan Anda di sini.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {currentUser.visitRevision?.name && currentUser.visitRevision.name !== 'Belum diunggah' && (
                    <button onClick={() => setPreviewDoc({ title: 'Berkas Perbaikan Visitasi', name: currentUser.visitRevision.name, url: currentUser.visitRevision.url, status: currentUser.visitRevision.status, note: '' })} className="text-xs bg-white text-emerald-700 border border-emerald-300 px-3 py-2 rounded-xl font-bold flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" /><span>Lihat Berkas</span>
                    </button>
                  )}
                  <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center space-x-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{currentUser.visitRevision?.name === 'Belum diunggah' ? 'Unggah Berkas Perbaikan' : 'Ganti Berkas Perbaikan'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleUploadVisitRevision(e.target.files[0]); }} />
                  </label>
                </div>
              </div>
              {currentUser.visitRevision?.name && currentUser.visitRevision.name !== 'Belum diunggah' && (
                <p className="text-xs text-emerald-700 mt-3 font-semibold">
                  ✓ Berkas terunggah: {currentUser.visitRevision.name} ({currentUser.visitRevision.status})
                </p>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-8">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar 28 Berkas Persyaratan Perizinan Klinik</h2>
                  <p className="text-xs text-gray-500">Silakan unggah seluruh berkas PDF persyaratan di bawah ini.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {LIST_28_DOKUMEN.map((item) => {
                  const docInfo = currentUser.documents[item.key] || { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi', note: '' };
                  return (
                    <div key={item.key} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <h3 className="font-bold text-gray-800 text-xs sm:text-sm">{item.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            docInfo.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                            docInfo.status === 'Catatan Perbaikan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {docInfo.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2">{item.desc}</p>

                        <div className="py-1.5 px-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium truncate">{docInfo.name}</span>
                          </div>
                          {docInfo.name !== 'Belum diunggah' && (
                            <button onClick={() => setPreviewDoc({ title: item.title, name: docInfo.name, url: docInfo.url, status: docInfo.status, note: docInfo.note })} className="text-xs text-emerald-700 font-bold hover:underline flex items-center space-x-1 ml-2">
                              <Eye className="w-3 h-3" /><span>Lihat</span>
                            </button>
                          )}
                        </div>

                        {docInfo.note && (
                          <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-800">
                            <span className="font-bold">Catatan:</span> {docInfo.note}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <label className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl transition flex items-center space-x-1 shadow-sm">
                          <Upload className="w-3 h-3" />
                          <span>{docInfo.name === 'Belum diunggah' ? 'Unggah PDF' : 'Ganti PDF'}</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleUploadDoc(item.key, e.target.files[0]); }} />
                        </label>
                        <span className="text-[10px] text-gray-400">PDF max 5MB</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentUser && currentUser.role === 'admin' && (
          <div className="w-full max-w-7xl space-y-6">
            <div className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center">
              <div>
                <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700">Panel Administrator</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Verifikasi Dokumen & Perbaikan Visitasi Klinik</h1>
                <p className="text-gray-300 text-xs mt-1">Dinas Kesehatan Kabupaten Badung • {currentDateFormatted}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-xl">{totalPengajuan}</div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Total Pengajuan</p><p className="text-xl font-extrabold text-gray-900">{totalPengajuan} Klinik</p></div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center font-bold text-xl">{sedangDiperiksaCount}</div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Sedang Diperiksa</p><p className="text-xl font-extrabold text-amber-700">{sedangDiperiksaCount} Klinik</p></div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100 flex items-center space-x-4">
                <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center font-bold text-xl">{sudahTerverifikasiCount}</div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Sudah Terverifikasi</p><p className="text-xl font-extrabold text-teal-700">{sudahTerverifikasiCount} Klinik</p></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Daftar Pemohon Klinik & Berkas Perbaikan Visitasi</h2>
              
              {users.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl"><p className="text-sm font-bold text-gray-700">Belum ada pemohon terdaftar.</p></div>
              ) : (
                <div className="space-y-6">
                  {users.map((u) => (
                    <div key={u.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 gap-3">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-extrabold text-gray-900 text-base">{u.clinicName}</h3>
                            <span className="bg-teal-100 text-teal-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">{u.clinicType || 'Klinik Pratama'}</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${u.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{u.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">PJ: {u.name} | Email: {u.email} | WA: {u.phone}</p>
                          
                          {u.visitRevision?.name && u.visitRevision.name !== 'Belum diunggah' && (
                            <div className="mt-2 inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs text-amber-900">
                              <span className="font-bold">Perbaikan Visitasi:</span>
                              <span>{u.visitRevision.name}</span>
                              <button onClick={() => setPreviewDoc({ title: 'Perbaikan Visitasi — ' + u.clinicName, name: u.visitRevision.name, url: u.visitRevision.url, status: u.visitRevision.status, note: '' })} className="text-emerald-700 font-bold underline ml-1">Lihat File</button>
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleDeleteUser(u.id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-200 flex items-center space-x-1">
                          <Trash2 className="w-3.5 h-3.5" /><span>Hapus Pemohon</span>
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {LIST_28_DOKUMEN.map((listItem) => {
                          const docVal = u.documents[listItem.key] || { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi', note: '' };
                          return (
                            <div key={listItem.key} className="bg-white rounded-xl p-3 border border-gray-200 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase truncate" title={listItem.title}>{listItem.title}</span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                                    docVal.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                                    docVal.status === 'Catatan Perbaikan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                  }`}>{docVal.status}</span>
                                </div>
                                <p className="text-[11px] font-medium text-gray-800 truncate mb-1.5">{docVal.name}</p>
                                
                                <button onClick={() => setPreviewDoc({ title: listItem.title, name: docVal.name, url: docVal.url, status: docVal.status, note: docVal.note, clinic: u.clinicName })} className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center space-x-1 mb-2">
                                  <Eye className="w-3 h-3" /><span>Lihat File PDF</span>
                                </button>

                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                  <select value={docVal.status} onChange={(e) => handleAdminUpdateDocStatus(u.id, listItem.key, e.target.value, docVal.note)} className="w-full text-[11px] bg-gray-50 border border-gray-200 rounded p-1">
                                    <option value="Menunggu Verifikasi">Menunggu</option>
                                    <option value="Sudah Terverifikasi">Terverifikasi</option>
                                    <option value="Catatan Perbaikan">Perbaikan</option>
                                  </select>
                                  <input type="text" placeholder="Catatan..." value={docVal.note} onChange={(e) => handleAdminUpdateDocStatus(u.id, listItem.key, docVal.status, e.target.value)} className="w-full text-[11px] bg-gray-50 border border-gray-200 rounded p-1" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl border border-emerald-100 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Pratinjau PDF Langsung</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-1">{previewDoc.title}</h3>
                {previewDoc.clinic && <p className="text-xs text-gray-500">Klinik: {previewDoc.clinic} — File: {previewDoc.name}</p>}
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex-grow bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
              {previewDoc.url ? (
                <iframe src={`${previewDoc.url}#toolbar=0`} title="PDF Preview" className="w-full h-full" />
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold">File PDF belum diunggah atau menggunakan file bawaan demo.</p>
                </div>
              )}
            </div>

            {previewDoc.note && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 mb-2">
                <span className="font-bold">Catatan Perbaikan:</span> {previewDoc.note}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500">Status: <strong className="text-emerald-700">{previewDoc.status}</strong></span>
              <button onClick={() => setPreviewDoc(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition">Tutup</buttom>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-emerald-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Dinas Kesehatan Kabupaten Badung. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
