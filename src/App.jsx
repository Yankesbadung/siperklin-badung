import React, { useState, useEffect } from 'react';
import { 
  Building2, FileText, CheckCircle2, Clock, AlertCircle, 
  User, Lock, Mail, Phone, LogOut, Upload, Eye, Download, 
  Trash2, X, ArrowRight, ShieldCheck, FileCheck, RefreshCw, AlertTriangle, FileSpreadsheet, Calendar, Check, Video, ExternalLink, ChevronRight, CheckCircle, FileCheck2, Bell, Menu 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// Inisialisasi koneksi Supabase menggunakan Environment Variables Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024; // 2 MB

// Validasi ukuran dan tipe file sebelum diunggah
const validateUploadFile = (file) => {
  if (!file) return false;
  if (file.type !== 'application/pdf') {
    alert('Hanya file PDF yang diperbolehkan.');
    return false;
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    alert(`Ukuran file ${sizeMb} MB melebihi batas maksimal 2 MB. Silakan kompres file terlebih dahulu.`);
    return false;
  }
  return true;
};

const LIST_28_DOKUMEN = [
  { key: 'dok_1', title: '1. Surat Permohonan Rekomendasi Klinik', desc: 'Surat permohonan resmi bermaterai' },
  { key: 'dok_2', title: '2. Foto SLF / PBG', desc: 'Foto SLF / PBG terbit' },
  { key: 'dok_3', title: '3. Foto NIB', desc: 'Foto NIB (Nomor Induk Berusaha)' },
  { key: 'dok_4', title: '4. Salinan / Foto Copy Legalitas Pelaku Usaha', desc: 'Foto Akte Notaris Pendirian Badan Hukum' },
  { key: 'dok_5', title: '5. Bukti Kepemilikan / Penguasaan Tanah & Gedung', desc: 'Sertifikat tanah / Akta sewa bangunan minimal 5 tahun' },
  { key: 'dok_6', title: '6. Dokumen UKL / UPL, SPPL', desc: 'Dokumen Pengelolaan dan Pemantauan Lingkungan Hidup' },
  { key: 'dok_7', title: '7. Daftar Obat dan BHP', desc: 'Daftar Obat dan Barang Habis Pakai' },
  { key: 'dok_8', title: '8. Dokumen Profil Klinik', desc: 'Profil Klinik Lengkap' },
  { key: 'dok_9', title: '9. Daftar SDM', desc: 'Daftar Nama SDM Sesuai Ketentuan' },
  { key: 'dok_10', title: '10. Dokumen Kalibrasi', desc: 'Dokumen Kalibrasi Alkes' },
  { key: 'dok_11', title: '11. Dokumen Self Assessment Klinik', desc: 'Dokumen Self Assessment Klinik Lengkap' },
  { key: 'dok_12', title: '12. MOU Limbah Medis B3', desc: 'Dokumen Perjanjian Kerja Sama' },
  { key: 'dok_13', title: '13. Denah Ruangan', desc: 'Gambar Denah Ruangan Jelas Beserta Ukurannya' },
  { key: 'dok_14', title: '14. Instalasi Kelistrikan', desc: 'Gambar Instalasi Jaringan Kelistrikan' },
  { key: 'dok_15', title: '15. Foto Copy Dokumen Genset', desc: 'Foto Copy Dokumen Genset' },
  { key: 'dok_16', title: '16. Penangung Jawab Klinik', desc: 'Foto KTP, SK Pengajuan Sebagai Penanggung Jawab, Surat Pernyataan Kesanggupan, Foto SKCK, FOTO STR dan SIP' },
  { key: 'dok_17', title: '17. Dokumen STR', desc: 'STR Semua Tenaga Kesehatan' },
  { key: 'dok_18', title: '18. SIP Semua Tenaga Kesehatan', desc: 'Untuk Perpanjangan Klinik' },
  { key: 'dok_19', title: '19. SOP', desc: 'SOP Yang Ditandatangani Penanggung Jawab Klinik' },
  { key: 'dok_20', title: '20. Rekomendasi Puskesmas', desc: 'Surat Pengantar Dari Puskesmas' },
  { key: 'dok_21', title: '21. Peta Lokasi', desc: 'Peta Lokasi Dari Google Map' },
  { key: 'dok_22', title: '22. Dokumen Pelaporan Program Nasional', desc: 'Untuk Perpanjangan Ijin' },
  { key: 'dok_23', title: '23. Dokumen Peraturan Internal Klinik', desc: 'Peraturan Internal Klinik' },
  { key: 'dok_24', title: '24. Bukti Registrasi Klinik', desc: 'Untuk Perpanjang Ijin' },
  { key: 'dok_25', title: '25. Surat Komitmen Akan Akreditasi', desc: 'Surat Resmi Bermaterai' },
  { key: 'dok_26', title: '26. Surat Komitmen Menggunakn RME', desc: 'Surat Resmi Bermaterai' },
  { key: 'dok_27', title: '27. MOU RME', desc: 'MOU Rekam Medis elektronik' },
  { key: 'dok_28', title: '28. Surat Komitmen Pengimputan INM', desc: 'Surat Komitmen Akan Pengimputan dan Pelaporan INM' },
];

const generateInitialDocuments = () => {
  const docs = {};
  LIST_28_DOKUMEN.forEach((item, index) => {
    docs[item.key] = {
      name: index === 0 ? 'Surat_Permohonan_Operasional.pdf' : 'Belum diunggah',
      url: '',
      status: index === 0 ? 'Sudah Terverifikasi' : 'Menunggu Verifikasi',
      note: '',
      verifiedAt: index === 0 ? new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
    };
  });
  return docs;
};

function NoteInputWithButton({ initialNote, onSaveNote }) {
  const [text, setText] = useState(initialNote || '');

  useEffect(() => {
    setText(initialNote || '');
  }, [initialNote]);

  return (
    <div className="flex space-x-1 mt-1">
      <input 
        type="text" 
        placeholder="Tulis catatan perbaikan..." 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="w-full text-[11px] bg-white border border-gray-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500" 
      />
      <button 
        type="button" 
        onClick={() => onSaveNote(text)}
        title="Simpan Catatan"
        className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center shadow-xs cursor-pointer transition flex-shrink-0"
      >
        <Check className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingDocKey, setUploadingDocKey] = useState(null);
  const [videoLinkInput, setVideoLinkInput] = useState('');

  const [selectedAdminClinicId, setSelectedAdminClinicId] = useState(null);
  const [visitNoteInput, setVisitNoteInput] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('documents');

  // State untuk drawer/modal pilihan klinik di HP agar tidak sempit
  const [showMobileClinicSelector, setShowMobileClinicSelector] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchProfiles = async () => {
    if (!supabase) return;
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.from('SIPERKLIN').select('id, name, email, phone, clinic_name, clinic_type, password, status, documents, visit_revision, video_link');
      if (error) {
        console.error('Supabase error:', error.message);
      } else if (data) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          clinicName: item.clinic_name,
          clinicType: item.clinic_type || 'Klinik Pratama',
          password: item.password,
          status: item.status || 'Menunggu Verifikasi',
          documents: item.documents || generateInitialDocuments(),
          visitRevision: item.visit_revision || { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi Visitasi', note: '', verifiedAt: '-' },
          videoLink: item.video_link || ''
        }));
        setUsers(formatted);

        if (formatted.length > 0 && !selectedAdminClinicId) {
          setSelectedAdminClinicId(formatted[0].id);
          setVisitNoteInput(formatted[0].visitRevision?.note || '');
        } else if (selectedAdminClinicId) {
          const active = formatted.find(u => u.id === selectedAdminClinicId);
          if (active) setVisitNoteInput(active.visitRevision?.note || '');
        }

        const currentSaved = localStorage.getItem('siperklin_current_user');
        if (currentSaved) {
          const parsedUser = JSON.parse(currentSaved);
          if (parsedUser.role !== 'admin') {
            const latestSelf = formatted.find(u => u.id === parsedUser.id);
            if (latestSelf) {
              setCurrentUser(latestSelf);
             setVideoLinkInput(latestSelf.videoLink || '');
              localStorage.setItem('siperklin_current_user', JSON.stringify(latestSelf));
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      setVideoLinkInput(currentUser.videoLink || '');
    }
  }, [currentUser]);

  useEffect(() => {
    const sel = users.find(u => u.id === selectedAdminClinicId);
    if (sel) {
      setVisitNoteInput(sel.visitRevision?.note || '');
    }
  }, [selectedAdminClinicId]);

  const [previewDoc, setPreviewDoc] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if ((loginInput.trim() === 'yankesbadung' || loginInput.trim() === 'yankesbadung@badungkab.go.id') && loginPassword === 'Pelayanankesehatan1') {
      const adminData = { role: 'admin', name: 'Administrator Bidang Yankes', email: 'yankesbadung' };
      setCurrentUser(adminData);
      setCurrentView('admin-dashboard');
      localStorage.setItem('siperklin_current_user', JSON.stringify(adminData));
      if (users.length > 0) setSelectedAdminClinicId(users[0].id);
      showNotification('Berhasil masuk sebagai Administrator.');
      return;
    }

    const foundUser = users.find(
      u => (u.email === loginInput.trim() || u.name.toLowerCase() === loginInput.trim().toLowerCase() || u.phone === loginInput.trim()) && u.password === loginPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setVideoLinkInput(foundUser.videoLink || '');
      setCurrentView('user-dashboard');
      localStorage.setItem('siperklin_current_user', JSON.stringify(foundUser));
      showNotification(`Selamat datang kembali, ${foundUser.clinicName}!`);
    } else {
      setLoginError('Username/Email/No. Telp atau Password salah, atau akun belum terdaftar.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    localStorage.removeItem('siperklin_current_user');
    showNotification('Anda telah keluar dari sistem.');
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
    const newDocuments = generateInitialDocuments();
    const newVisitRevision = { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi Visitasi', note: '', verifiedAt: '-' };

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
          documents: newDocuments,
          visit_revision: newVisitRevision,
          video_link: ''
        }
      ]);
      if (error) {
        alert('Gagal menyimpan ke database cloud: ' + error.message);
        return;
      }
    }

    setRegSuccess('Pendaftaran berhasil! Silakan masuk.');
    showNotification('Pendaftaran akun klinik berhasil!');
    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegClinicName(''); setRegClinicType('Klinik Pratama');
    fetchProfiles();
    setTimeout(() => { setAuthTab('login'); setRegSuccess(''); }, 2000);
  };

  const handleUploadDoc = async (docKey, file) => {
    if (!supabase) return;
    if (!validateUploadFile(file)) return;
    setUploadingDocKey(docKey);

    try {
      const fileName = `${currentUser.id}_${docKey}_${Date.now()}.pdf`;
       
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('siperklin-files')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        alert('Gagal mengunggah file ke Storage: ' + uploadError.message);
        setUploadingDocKey(null);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('siperklin-files')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const updatedDocs = {
        ...currentUser.documents,
        [docKey]: { 
          name: file.name, 
          url: publicUrl, 
          status: 'Menunggu Verifikasi', 
          note: '',
          verifiedAt: '-'
        }
      };

      const { error: dbError } = await supabase.from('SIPERKLIN').update({
        documents: updatedDocs,
        status: 'Sedang Diperiksa'
      }).eq('id', currentUser.id);

      if (dbError) {
        alert('Gagal menyimpan tautan dokumen ke database: ' + dbError.message);
      } else {
        showNotification('Dokumen PDF berhasil diunggah!');
        fetchProfiles();
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Terjadi kesalahan saat mengunggah file.');
    } finally {
      setUploadingDocKey(null);
    }
  };

  const handleUploadVisitRevision = async (file) => {
    if (!supabase) return;
    if (!validateUploadFile(file)) return;

    try {
      const fileName = `${currentUser.id}_visit_${Date.now()}.pdf`;
       
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('siperklin-files')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        alert('Gagal mengunggah berkas perbaikan: ' + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('siperklin-files')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const revisionData = {
        name: file.name,
        url: publicUrl,
        status: 'Menunggu Verifikasi Visitasi',
        note: '',
        verifiedAt: '-'
      };

      const { error: dbError } = await supabase.from('SIPERKLIN').update({
        visit_revision: revisionData,
        status: 'Menunggu Verifikasi Visitasi'
      }).eq('id', currentUser.id);

      if (dbError) {
        alert('Gagal menyimpan ke database: ' + dbError.message);
      } else {
        showNotification('Berkas perbaikan visitasi berhasil diunggah!');
        fetchProfiles();
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleSaveVideoLink = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('SIPERKLIN').update({
        video_link: videoLinkInput
      }).eq('id', currentUser.id);

      if (error) {
        alert('Gagal menyimpan link video: ' + error.message);
      } else {
        showNotification('Tautan video berhasil disimpan!');
        fetchProfiles();
      }
    } catch (err) {
      console.error('Save video link error:', err);
    }
  };

  const handleAdminUpdateDocStatus = async (userId, docKey, newStatus, newNote) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const verificationTimestamp = (newStatus === 'Sudah Terverifikasi' || newStatus === 'Catatan Perbaikan') ? formattedDate : '-';

    const finalNote = (newStatus === 'Sudah Terverifikasi') ? '' : newNote;

    const updatedDocs = {
      ...targetUser.documents,
      [docKey]: { 
        ...targetUser.documents[docKey], 
        status: newStatus, 
        note: finalNote,
        verifiedAt: verificationTimestamp
      }
    };

    const statuses = Object.values(updatedDocs).map(d => d.status);
    let overallStatus = 'Sedang Diperiksa';
    if (statuses.every(s => s === 'Sudah Terverifikasi')) {
      overallStatus = 'Sudah Terverifikasi';
    } else if (statuses.some(s => s === 'Catatan Perbaikan')) {
      overallStatus = 'Catatan Perbaikan';
    }

    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, documents: updatedDocs, status: overallStatus } : u));

    if (supabase) {
      const { error } = await supabase.from('SIPERKLIN').update({
        documents: updatedDocs,
        status: overallStatus
      }).eq('id', userId);

      if (error) {
        alert('Gagal memperbarui ke database: ' + error.message);
        return;
      }
    }
    showNotification(`Status dokumen diperbarui: ${newStatus}`);
  };

  const handleAdminUpdateVisitStatus = async (userId, newStatus) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser || !targetUser.visitRevision || targetUser.visitRevision.name === 'Belum diunggah') {
      alert('Belum ada berkas perbaikan visitasi yang diunggah oleh pemohon.');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const verificationTimestamp = (newStatus === 'Sudah Terverifikasi' || newStatus === 'Catatan Perbaikan Visitasi') ? formattedDate : '-';

    const finalVisitNote = (newStatus === 'Sudah Terverifikasi') ? '' : visitNoteInput;

    const updatedVisit = {
      ...targetUser.visitRevision,
      status: newStatus,
      note: finalVisitNote,
      verifiedAt: verificationTimestamp
    };

    let overallStatus = targetUser.status;
    if (newStatus === 'Sudah Terverifikasi') {
      overallStatus = 'Sudah Terverifikasi';
    } else if (newStatus === 'Catatan Perbaikan Visitasi') {
      overallStatus = 'Catatan Perbaikan Visitasi';
    }

    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, visitRevision: updatedVisit, status: overallStatus } : u));
    setVisitNoteInput(finalVisitNote);

    if (supabase) {
      const { error } = await supabase.from('SIPERKLIN').update({
        visit_revision: updatedVisit,
        status: overallStatus
      }).eq('id', userId);

      if (error) {
        alert('Gagal memperbarui status perbaikan visitasi: ' + error.message);
        return;
      }
    }
    showNotification(`Verifikasi visitasi diperbarui: ${newStatus}`);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Yakin ingin menghapus pemohon ini?')) {
      if (supabase) {
        await supabase.from('SIPERKLIN').delete().eq('id', userId);
      }
      if (selectedAdminClinicId === userId) {
        const remaining = users.filter(u => u.id !== userId);
        setSelectedAdminClinicId(remaining.length > 0 ? remaining[0].id : null);
      }
      showNotification('Data pemohon klinik berhasil dihapus.');
      fetchProfiles();
    }
  };

  const handleExportExcel = () => {
    if (users.length === 0) {
      alert('Tidak ada data rekapitulasi untuk diunduh.');
      return;
    }

    const dataToExport = users.map((u, index) => {
      const totalUploaded = Object.values(u.documents || {}).filter(d => d.name !== 'Belum diunggah').length;
      return {
        No: index + 1,
        'Nama Klinik': u.clinicName,
        'Jenis Klinik': u.clinicType || 'Klinik Pratama',
        'Penanggung Jawab': u.name,
        'Email': u.email,
        'No. WhatsApp': u.phone,
        'Status Pengajuan': u.status,
        'Dokumen Terunggah (Dari 28)': `${totalUploaded} / 28 Dokumen`,
        'Berkas Perbaikan Visitasi': u.visitRevision?.name && u.visitRevision.name !== 'Belum diunggah' ? `${u.visitRevision.name} (${u.visitRevision.status})` : 'Belum Ada',
        'Link Video': u.videoLink || '-'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Pengajuan Klinik');
    XLSX.writeFile(workbook, `Rekap_Pengajuan_SIPERKLIN_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Rekap Excel berhasil diunduh!');
  };

  const totalPengajuan = users.length;
  const sedangDiperiksaCount = users.filter(u => u.status !== 'Sudah Terverifikasi').length;
  const sudahTerverifikasiCount = users.filter(u => u.status === 'Sudah Terverifikasi').length;
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const selectedClinic = users.find(u => u.id === selectedAdminClinicId) || users[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-800 flex flex-col justify-between relative">
      
      {/* NOTIFIKASI POP-UP FLOATING */}
      {notification && (
        <div className="fixed top-20 right-2 left-2 sm:left-auto sm:right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-300">Pemberitahuan Sistem</p>
            <p className="text-xs text-gray-100">{notification.message}</p>
          </div>
        </div>
      )}

      {/* MODAL PEMILIH KLINIK KHUSUS HP (MOBILE DRAWER) */}
      {showMobileClinicSelector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[80vh] p-5 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase">Pilih Klinik Pemohon</h3>
              <button onClick={() => setShowMobileClinicSelector(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 flex-grow">
              {users.map((u) => {
                const isSelected = selectedClinic && selectedClinic.id === u.id;
                return (
                  <div 
                    key={u.id}
                    onClick={() => {
                      setSelectedAdminClinicId(u.id);
                      setShowMobileClinicSelector(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{u.clinicName}</p>
                      <p className="text-[11px] opacity-80">PJ: {u.name} — Status: {u.status}</p>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => { if(!currentUser) setCurrentView('login'); }}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base sm:text-xl text-emerald-900 tracking-tight">SIPERKLIN</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">v2.1</span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden xs:block">Sistem Informasi Pendaftaran Rekomendasi Klinik</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <button onClick={() => { fetchProfiles(); showNotification('Data berhasil disinkronkan.'); }} disabled={isRefreshing} className="flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition border border-emerald-200 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sinkronkan</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">{currentUser.role === 'admin' ? 'Administrator Bidang Yankes' : currentUser.clinicName}</p>
                </div>
                <button onClick={handleLogout} className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-red-200 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xs:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="hidden sm:inline">Dinas Kesehatan Badung</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-3 sm:p-6 lg:p-8">
        {!currentUser && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-emerald-100">
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-6 sm:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-white/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3">SIPERKLIN YANKES</h1>
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-4">
                  Portal pengurusan rekomendasi perizinan klinik Pratama dan Utama dengan persyaratan lengkap dokumen resmi.
                </p>
              </div>
              <div className="pt-4 border-t border-emerald-700/60 text-[11px] sm:text-xs text-emerald-200">
                Bidang Pelayanan Kesehatan Dinas Kesehatan Kabupaten Badung
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
              <div className="flex bg-gray-100 p-1 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 max-w-sm">
                <button onClick={() => setAuthTab('login')} className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition cursor-pointer ${authTab === 'login' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}>Masuk Akun</button>
                <button onClick={() => setAuthTab('register')} className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition cursor-pointer ${authTab === 'register' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500'}`}>Pendaftaran Baru</button>
              </div>

              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Selamat Datang Kembali</h2>
                  {loginError && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2"><AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{loginError}</span></div>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 sm:mb-2">Username / Email / No. Telp</label>
                    <input type="text" required value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="yankesbadung / 081234567890" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 sm:mb-2">Password</label>
                    <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer text-sm">
                    <span>Masuk Sekarang</span><ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                    <p>• <strong>Admin:</strong> <code className="bg-white px-1 font-bold text-emerald-700">yankesbadung</code></p>
                  </div>
                </form>
              )}

              {authTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Pendaftaran Akun Klinik</h2>
                  {regSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl"><span>{regSuccess}</span></div>}
                   
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Pemohon</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Dr. Nama & Gelar" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Klinik</label>
                      <input type="text" required value={regClinicName} onChange={(e) => setRegClinicName(e.target.value)} placeholder="Klinik Pratama ..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Jenis Klinik</label>
                    <select value={regClinicType} onChange={(e) => setRegClinicType(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer">
                      <option value="Klinik Pratama">Klinik Pratama</option>
                      <option value="Klinik Utama">Klinik Utama</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                      <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email@klinik.com" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">No. WhatsApp</label>
                      <input type="text" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="081234567890" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                    <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition cursor-pointer text-sm">Daftar Sekarang</button>
                </form>
              )}
            </div>
          </div>
        )}

        {currentUser && currentUser.role !== 'admin' && (
          <div className="w-full max-w-6xl space-y-5">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-5 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-700 text-emerald-100 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-600">Dashboard Pemohon ({currentUser.clinicType})</span>
                <h1 className="text-xl sm:text-3xl font-extrabold mt-2">{currentUser.clinicName}</h1>
                <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">PJ: {currentUser.name} | WA: {currentUser.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/25">
                <p className="text-[10px] sm:text-xs text-emerald-200 font-medium">Status Pengajuan</p>
                <p className="text-xs sm:text-sm font-bold flex items-center space-x-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0" />
                  <span>{currentUser.status}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-amber-200 p-5 sm:p-8 bg-amber-50/30 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-amber-800 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                    <h2 className="text-sm sm:text-base">Menu Perbaikan / Tindak Lanjut Setelah Visitasi Lapangan</h2>
                  </div>
                  <p className="text-xs text-gray-600">
                    Jika tim Dinas Kesehatan telah melakukan visitasi dan memberikan catatan perbaikan, silakan unggah dokumen/berkas perbaikan Anda di sini (PDF, maksimal 2 MB).
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {currentUser.visitRevision?.name && currentUser.visitRevision.name !== 'Belum diunggah' && (
                    <button onClick={() => setPreviewDoc({ title: 'Berkas Perbaikan Visitasi', name: currentUser.visitRevision.name, url: currentUser.visitRevision.url, status: currentUser.visitRevision.status, note: currentUser.visitRevision.note })} className="text-xs bg-white text-emerald-700 border border-emerald-300 px-3 py-2.5 rounded-xl font-bold flex items-center space-x-1 cursor-pointer flex-shrink-0">
                      <Eye className="w-3.5 h-3.5" /><span>Lihat</span>
                    </button>
                  )}
                  <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center space-x-1.5 flex-grow sm:flex-grow-0">
                    <Upload className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{currentUser.visitRevision?.name === 'Belum diunggah' ? 'Unggah Berkas Perbaikan' : 'Ganti Berkas Perbaikan'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) handleUploadVisitRevision(f); }} />
                  </label>
                </div>
              </div>

              {currentUser.visitRevision?.name && currentUser.visitRevision.name !== 'Belum diunggah' && (
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <p className="text-xs text-emerald-700 font-bold">
                    ✓ Berkas terunggah: {currentUser.visitRevision.name} — <span className="underline">{currentUser.visitRevision.status}</span>
                  </p>
                  {currentUser.visitRevision.note && (
                    <p className="text-xs text-red-700 font-medium">
                      <strong>Catatan Admin:</strong> {currentUser.visitRevision.note}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-amber-200/60">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold mb-1">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base">Link Video Dokumentasi / Tinjauan Lapangan</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Masukkan tautan video (contoh: YouTube, Google Drive, atau tautan cloud lainnya) terkait profil klinik atau video pendukung peninjauan.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="url" 
                    placeholder="https://youtube.com/... atau https://drive.google.com/..." 
                    value={videoLinkInput}
                    onChange={(e) => setVideoLinkInput(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={handleSaveVideoLink}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition cursor-pointer flex items-center justify-center space-x-1 flex-shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Link Video</span>
                  </button>
                </div>
                {currentUser.videoLink && (
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <span className="text-gray-500">Tautan aktif:</span>
                    <a href={currentUser.videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center space-x-1">
                      <span>Buka Tautan Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-5 sm:p-8">
              <div className="mb-5 flex justify-between items-center">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Daftar 28 Berkas Persyaratan Perizinan Klinik</h2>
                  <p className="text-xs text-gray-500">Silakan unggah seluruh berkas PDF persyaratan di bawah ini (maksimal 2 MB per file).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                {LIST_28_DOKUMEN.map((item) => {
                  const docInfo = currentUser.documents[item.key] || { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi', note: '', verifiedAt: '-' };
                  const isUploading = uploadingDocKey === item.key;
                  return (
                    <div key={item.key} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition">
                      <div>
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <h3 className="font-bold text-gray-800 text-xs sm:text-sm">{item.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                            docInfo.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                            docInfo.status === 'Catatan Perbaikan' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {docInfo.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-2">{item.desc}</p>

                        <div className="py-2 px-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium truncate">{docInfo.name}</span>
                          </div>
                          {docInfo.name !== 'Belum diunggah' && (
                            <button onClick={() => setPreviewDoc({ title: item.title, name: docInfo.name, url: docInfo.url, status: docInfo.status, note: docInfo.note })} className="text-xs text-emerald-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer flex-shrink-0">
                              <Eye className="w-3 h-3" /><span>Lihat</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-500 bg-emerald-50/50 px-2.5 py-1.5 rounded-lg mb-2 border border-emerald-100">
                          <span className="flex items-center space-x-1"><Calendar className="w-3 h-3 text-emerald-600" /><span>Verifikasi:</span></span>
                          <span className="font-bold text-emerald-900">{docInfo.verifiedAt || '-'}</span>
                        </div>

                        {docInfo.note && (
                          <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-800">
                            <span className="font-bold">Catatan:</span> {docInfo.note}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <label className={`cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl transition flex items-center space-x-1 shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Upload className="w-3 h-3" />
                          <span>{isUploading ? 'Mengunggah...' : (docInfo.name === 'Belum diunggah' ? 'Unggah PDF' : 'Ganti PDF')}</span>
                          <input type="file" accept="application/pdf" disabled={isUploading} className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) handleUploadDoc(item.key, f); }} />
                        </label>
                        <span className="text-[10px] text-gray-400">Cloud Storage</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* DASHBOARD ADMIN RESPONSIF UNTUK HP DAN DESKTOP */}
        {currentUser && currentUser.role === 'admin' && (
          <div className="w-full max-w-7xl space-y-5">
            <div className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="bg-emerald-800 text-emerald-200 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-700">Panel Administrator</span>
                <h1 className="text-xl sm:text-3xl font-extrabold mt-1.5">Verifikasi Berkas & Kelayakan Klinik</h1>
                <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5">Dinas Kesehatan Kabupaten Badung • {currentDateFormatted}</p>
              </div>
              <button onClick={handleExportExcel} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 border border-emerald-500 cursor-pointer">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Rekap Excel (.xlsx)</span>
              </button>
            </div>

            {/* KARTU STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-emerald-100 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-700 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl flex-shrink-0">{totalPengajuan}</div>
                <div><p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Total Pengajuan</p><p className="text-base sm:text-lg font-extrabold text-gray-900">{totalPengajuan} Klinik</p></div>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-100 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 text-amber-700 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl flex-shrink-0">{sedangDiperiksaCount}</div>
                <div><p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Sedang Diperiksa</p><p className="text-base sm:text-lg font-extrabold text-amber-700">{sedangDiperiksaCount} Klinik</p></div>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-teal-100 flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-50 text-teal-700 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl flex-shrink-0">{sudahTerverifikasiCount}</div>
                <div><p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Sudah Terverifikasi</p><p className="text-base sm:text-lg font-extrabold text-teal-700">{sudahTerverifikasiCount} Klinik</p></div>
              </div>
            </div>

          {/* TOMBOL AKSI CEPAT PILIH KLINIK (KHUSUS TAMPILAN HP) */}
          <div className="block lg:hidden">
            <button 
              onClick={() => setShowMobileClinicSelector(true)}
              className="w-full bg-emerald-700 text-white font-bold p-3.5 rounded-2xl shadow-md flex items-center justify-between text-xs cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate pr-2">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Klinik Dipilih: <strong>{selectedClinic ? selectedClinic.clinicName : 'Pilih Klinik'}</strong></span>
              </div>
              <span className="bg-emerald-900 text-emerald-100 px-2.5 py-1 rounded-lg text-[10px] flex-shrink-0">Ganti Klinik ▾</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* SIDEBAR DESKTOP (DISEMBUNYIKAN DI HP) */}
            <div className="hidden lg:flex lg:col-span-4 bg-white rounded-3xl shadow-sm border border-emerald-100 p-5 flex-col sticky top-24">
              <div className="mb-4 pb-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Pilih Klinik Pemohon</h2>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {users.length} Klinik
                </span>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">Belum ada pemohon terdaftar.</div>
              ) : (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {users.map((u) => {
                    const isSelected = selectedClinic && selectedClinic.id === u.id;
                    const verifiedCount = Object.values(u.documents || {}).filter(d => d.status === 'Sudah Terverifikasi').length;
                    return (
                      <div 
                        key={u.id}
                        onClick={() => setSelectedAdminClinicId(u.id)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-md' 
                            : 'bg-gray-50/90 hover:bg-emerald-50/70 border-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{u.clinicName}</p>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>PJ: {u.name}</p>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected 
                                ? 'bg-emerald-800 text-emerald-100 border border-emerald-600' 
                                : (u.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')
                            }`}>
                              {u.status}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${isSelected ? 'bg-emerald-800/80 text-white' : 'bg-gray-200 text-gray-700'}`}>
                              Doc: {verifiedCount}/28
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* KONTEN UTAMA VERIFIKASI KLINIK TERPILIH */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-emerald-100 p-4 sm:p-8 space-y-5">
              {selectedClinic ? (
                <>
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1 truncate">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-xl font-extrabold text-emerald-950 truncate">{selectedClinic.clinicName}</h2>
                        <span className="bg-teal-200 text-teal-900 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold">{selectedClinic.clinicType || 'Klinik Pratama'}</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-700 truncate">
                        <strong>PJ:</strong> {selectedClinic.name} &bull; <strong>WA:</strong> {selectedClinic.phone}
                      </p>
                    </div>

                    <button onClick={() => handleDeleteUser(selectedClinic.id)} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border border-red-200 flex items-center space-x-1 cursor-pointer transition flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" /><span>Hapus Pemohon</span>
                    </button>
                  </div>

                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button 
                      onClick={() => setAdminActiveTab('documents')}
                      className={`pb-2.5 sm:pb-3 px-3 sm:px-5 text-xs font-extrabold transition border-b-2 cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
                        adminActiveTab === 'documents' 
                          ? 'border-emerald-700 text-emerald-800' 
                          : 'border-transparent text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Verifikasi 28 Dokumen</span>
                    </button>
                    <button 
                      onClick={() => setAdminActiveTab('visit')}
                      className={`pb-2.5 sm:pb-3 px-3 sm:px-5 text-xs font-extrabold transition border-b-2 cursor-pointer flex items-center space-x-1 flex-shrink-0 ${
                        adminActiveTab === 'visit' 
                          ? 'border-emerald-700 text-emerald-800' 
                          : 'border-transparent text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Visitasi & Video</span>
                    </button>
                  </div>

                  {adminActiveTab === 'documents' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Daftar Berkas Persyaratan (1 s.d 28)</span>
                        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                          {Object.values(selectedClinic.documents || {}).filter(d => d.status === 'Sudah Terverifikasi').length}/28 Valid
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                        {LIST_28_DOKUMEN.map((listItem) => {
                          const docVal = selectedClinic.documents[listItem.key] || { name: 'Belum diunggah', url: '', status: 'Menunggu Verifikasi', note: '', verifiedAt: '-' };
                          const isVerified = docVal.status === 'Sudah Terverifikasi';
                          const isRevision = docVal.status === 'Catatan Perbaikan';

                          return (
                            <div key={listItem.key} className={`rounded-2xl p-3.5 sm:p-4 border transition flex flex-col justify-between ${
                              isVerified ? 'bg-emerald-50/30 border-emerald-200' : isRevision ? 'bg-red-50/30 border-red-200' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div>
                                <div className="flex justify-between items-start mb-1.5 gap-1">
                                  <span className="text-[11px] font-extrabold text-gray-900 leading-tight" title={listItem.title}>{listItem.title}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                                    isVerified ? 'bg-emerald-100 text-emerald-900' : isRevision ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                                  }`}>{docVal.status}</span>
                                </div>

                                <p className="text-[11px] font-medium text-gray-600 truncate mb-2">
                                  File: <strong className="text-gray-900 truncate">{docVal.name}</strong>
                                </p>
                                
                                <div className="flex items-center justify-between mb-2.5">
                                  {docVal.name !== 'Belum diunggah' ? (
                                    <button onClick={() => setPreviewDoc({ title: listItem.title, name: docVal.name, url: docVal.url, status: docVal.status, note: docVal.note, clinic: selectedClinic.clinicName })} className="text-xs bg-white text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-50 flex items-center space-x-1 cursor-pointer shadow-xs">
                                      <Eye className="w-3.5 h-3.5" /><span>Pratinjau PDF</span>
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-gray-400 italic">Belum diunggah</span>
                                  )}
                                  <span className="text-[10px] text-gray-500">{docVal.verifiedAt !== '-' ? `Verif: ${docVal.verifiedAt}` : ''}</span>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleAdminUpdateDocStatus(selectedClinic.id, listItem.key, 'Sudah Terverifikasi', docVal.note)}
                                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                                        isVerified ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" /><span>Valid</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAdminUpdateDocStatus(selectedClinic.id, listItem.key, 'Catatan Perbaikan', docVal.note)}
                                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                                        isRevision ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-red-700 border border-red-300 hover:bg-red-50'
                                      }`}
                                    >
                                      <X className="w-3.5 h-3.5" /><span>Perbaikan</span>
                                    </button>
                                  </div>

                                  <NoteInputWithButton 
                                    initialNote={docVal.note} 
                                    onSaveNote={(text) => handleAdminUpdateDocStatus(selectedClinic.id, listItem.key, docVal.status, text)} 
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {adminActiveTab === 'visit' && (
                    <div className="space-y-5 animate-fadeIn bg-gray-50/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 mb-1">Verifikasi Tindak Lanjut Visitasi Lapangan</h3>
                        <p className="text-xs text-gray-500">Periksa dokumen koreksi hasil kunjungan lapangan serta tautan video dokumentasi klinik.</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-800">Berkas PDF Perbaikan Visitasi</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            selectedClinic.visitRevision?.status === 'Sudah Terverifikasi' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {selectedClinic.visitRevision?.status || 'Belum Ada'}
                          </span>
                        </div>

                        {selectedClinic.visitRevision?.name && selectedClinic.visitRevision.name !== 'Belum diunggah' ? (
                          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 gap-2">
                            <span className="text-xs font-medium text-gray-700 truncate max-w-full xs:max-w-[200px]">{selectedClinic.visitRevision.name}</span>
                            <button 
                              onClick={() => setPreviewDoc({ title: 'Perbaikan Visitasi — ' + selectedClinic.clinicName, name: selectedClinic.visitRevision.name, url: selectedClinic.visitRevision.url, status: selectedClinic.visitRevision.status, note: selectedClinic.visitRevision.note })} 
                              className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" /><span>Lihat Berkas</span>
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Pemohon belum mengunggah berkas perbaikan visitasi.</p>
                        )}

                        {selectedClinic.visitRevision?.name && selectedClinic.visitRevision.name !== 'Belum diunggah' && (
                          <div className="space-y-2 pt-2">
                            <input 
                              type="text"
                              placeholder="Tulis catatan perbaikan visitasi..."
                              value={visitNoteInput}
                              onChange={(e) => setVisitNoteInput(e.target.value)}
                              className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-emerald-500"
                            />
                            <div className="flex flex-col xs:flex-row gap-2">
                              <button 
                                type="button"
                                onClick={() => handleAdminUpdateVisitStatus(selectedClinic.id, 'Sudah Terverifikasi')}
                                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-1"
                              >
                                <Check className="w-4 h-4" />
                                <span>Valid / Terverifikasi</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleAdminUpdateVisitStatus(selectedClinic.id, 'Catatan Perbaikan Visitasi')}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>Minta Perbaikan</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                        <span className="text-xs font-bold text-gray-800">Tautan Video Dokumentasi Lapangan</span>
                        {selectedClinic.videoLink ? (
                          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 gap-2">
                            <span className="text-xs text-emerald-900 font-medium truncate max-w-full xs:max-w-[220px]">{selectedClinic.videoLink}</span>
                            <a href={selectedClinic.videoLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 shadow-xs flex-shrink-0">
                              <span>Buka Video</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Pemohon belum mencantumkan link video.</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">Pilih salah satu klinik pada panel di atas untuk mulai memverifikasi berkas.</div>
              )}
            </div>

          </div>
        </div>
      )}
      </main>

      {/* MODAL PRATINJAU PDF */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] p-4 sm:p-6 shadow-2xl border border-emerald-100 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Pratinjau Dokumen PDF</span>
                <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 mt-1 truncate max-w-xs sm:max-w-xl">{previewDoc.title}</h3>
                {previewDoc.clinic && <p className="text-xs text-gray-500">Klinik: {previewDoc.clinic}</p>}
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-700 transition cursor-pointer flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 flex-grow bg-gray-100 rounded-2xl overflow-y-auto border border-gray-200 relative flex flex-col">
              {previewDoc.url ? (
                <>
                  <div className="bg-emerald-900 text-white text-[11px] p-2 px-3 sm:px-4 flex justify-between items-center flex-shrink-0 gap-2">
                    <span className="truncate">Geser atau buka layar penuh untuk melihat seluruh halaman.</span>
                    <a 
                      href={previewDoc.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 flex-shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span>Layar Penuh</span>
                    </a>
                  </div>
                  
                  <iframe 
                    src={`${previewDoc.url}#view=FitH`} 
                    title="PDF Preview" 
                    className="w-full flex-grow min-h-[450px]" 
                  />
                </>
              ) : (
                <div className="text-center p-6 text-gray-500 my-auto">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold">File PDF belum diunggah atau menggunakan file bawaan demo.</p>
                </div>
              )}
            </div>

            {previewDoc.note && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 mb-2 flex-shrink-0">
                <span className="font-bold">Catatan Perbaikan:</span> {previewDoc.note}
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
              <span className="text-xs text-gray-500">Status: <strong className="text-emerald-700">{previewDoc.status}</strong></span>
              <button onClick={() => setPreviewDoc(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer">Tutup</button>
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
