import React, { useState, useEffect } from 'react';
import { 
  Home, FileText, Users, User, LogOut, Plus, Search, Bell, Menu, 
  ChevronRight, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Shield, Building, Activity, MessageCircle, AlertCircle, ChevronLeft
} from 'lucide-react';
import LoginPage from './Login';
import logo from './assets/logo.png'; 

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const INSTITUTIONS_LIST = [
  { id: 1, name: "T.C. İçişleri Bakanlığı", departments: [
      { id: 10, name: "Bilgi İşlem" },
      { id: 11, name: "Personel Daire Bşk." }
    ] 
  },
  { id: 2, name: "Emniyet Genel Müdürlüğü", departments: [
      { id: 20, name: "Yönetim" },
      { id: 30, name: "Arşiv" },
      { id: 40, name: "Saha Operasyon" }
    ] 
  }
];

const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  LOCAL_ADMIN: 'LocalAdmin',
  USER: 'User'
};

const STATUS = {
  PENDING: 0, LOCAL_APPROVED: 1, PUBLISHED: 2, REJECTED: 3
};

const DEFAULT_USERS = [
  { id: 1, username: "superadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "SuperAdmin", name: "Ahmet Yılmaz", institution: "T.C. İçişleri Bakanlığı", department: "Bilgi İşlem", institutionId: 1, departmentId: 10, email: "ahmet@gov.tr", phone: "5551112233" },
  { id: 2, username: "admin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "Admin", name: "Fatma Çelik", institution: "Emniyet Genel Müdürlüğü", department: "Yönetim", institutionId: 2, departmentId: 20, email: "fatma@egm.gov.tr", phone: "5552223344" },
  { id: 3, username: "localadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "LocalAdmin", name: "Mehmet Demir", institution: "Emniyet Genel Müdürlüğü", department: "Arşiv", institutionId: 2, departmentId: 30, email: "mehmet@egm.gov.tr", phone: "5553334455" },
  { id: 4, username: "user", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "User", name: "Ali Veli", institution: "Emniyet Genel Müdürlüğü", department: "Saha Operasyon", institutionId: 2, departmentId: 40, email: "ali@egm.gov.tr", phone: "5554445566" }
];

const INITIAL_CONTENTS = [
  { id: 101, institutionId: 1, departmentId: 10, institution: "İçişleri Bakanlığı", question: "Sunucu bakımı ne zaman yapılacak?", answer: "Bu hafta sonu planlanmıştır.", status: STATUS.PUBLISHED, rejectionReason: null },
  { id: 102, institutionId: 2, departmentId: 40, institution: "Emniyet Genel Müdürlüğü", question: "Saha ekiplerine tablet dağıtımı başladı mı?", answer: "Henüz tedarik aşamasında.", status: STATUS.PENDING, rejectionReason: null },
  { id: 103, institutionId: 2, departmentId: 30, institution: "Emniyet Genel Müdürlüğü", question: "Arşiv dijitalleştirme süreci yüzde kaçta?", answer: "%45 oranında tamamlandı.", status: STATUS.LOCAL_APPROVED, rejectionReason: null },
  { id: 104, institutionId: 2, departmentId: 30, institution: "Emniyet Genel Müdürlüğü", question: "Eski belgeler imha edilecek mi?", answer: "Hayır, dijitalleşip saklanacak.", status: STATUS.REJECTED, rejectionReason: "Yönergeye uygun değil." },
  { id: 105, institutionId: 2, departmentId: 40, institution: "Emniyet Genel Müdürlüğü", question: "Araç takip sistemi aktif mi?", answer: "Evet aktif.", status: STATUS.PUBLISHED, rejectionReason: null },
  { id: 106, institutionId: 2, departmentId: 20, institution: "Emniyet Genel Müdürlüğü", question: "Personel alımı ne zaman?", answer: "Yıl sonunda.", status: STATUS.PENDING, rejectionReason: null },
];

const SIDEBAR_ITEMS = [
  { id: 'anasayfa', label: 'Ana Sayfa', icon: <Home size={20} />, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
  { id: 'sorular', label: 'Sorular / Cevaplar', icon: <MessageCircle size={20} />, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
  { id: 'kullanicilar', label: 'Kullanıcılar', icon: <Users size={20} />, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN] },
  { id: 'logs', label: 'Sistem Kayıtları', icon: <Activity size={20} />, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { id: 'profil', label: 'Profilim', icon: <User size={20} />, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('anasayfa');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [contents, setContents] = useState(INITIAL_CONTENTS);
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [logs, setLogs] = useState([]);
  
  const [showContentModal, setShowContentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  const handleLoginSuccess = (incomingUser) => {
    const fullUser = users.find(u => u.username === incomingUser.username);
    const finalUser = fullUser || incomingUser;
    setCurrentUser(finalUser);
    setActiveTab('anasayfa');
    
    const newLog = { id: Date.now(), userId: finalUser.id || 999, userName: finalUser.username, action: "Sisteme Giriş", ip: "127.0.0.1", date: new Date().toLocaleString(), institutionId: finalUser.institutionId || 0 };
    setLogs([newLog, ...logs]);
  };

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

  const handleSaveContent = (formData) => {
    let initialStatus = STATUS.PENDING;
    if (currentUser.role === ROLES.LOCAL_ADMIN) initialStatus = STATUS.LOCAL_APPROVED;
    else if (currentUser.role === ROLES.ADMIN || currentUser.role === ROLES.SUPER_ADMIN) initialStatus = STATUS.PUBLISHED;

    const newItem = {
      id: Date.now(),
      institutionId: currentUser.institutionId || 0,
      departmentId: currentUser.departmentId || 0, 
      institution: currentUser.institution || "Bilinmeyen",
      question: formData.question,
      answer: formData.answer,
      status: initialStatus,
      rejectionReason: null
    };
    setContents([newItem, ...contents]);
    setShowContentModal(false);
    
    if (initialStatus === STATUS.PUBLISHED) alert("Soru eklendi ve YAYINLANDI.");
    else if (initialStatus === STATUS.LOCAL_APPROVED) alert("Soru eklendi. (Admin onayı bekleniyor)");
    else alert("Soru eklendi. (Yönetici onayı bekleniyor)");
  };

  const handleDeleteContent = (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) setContents(prev => prev.filter(c => c.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setContents(contents.map(c => c.id === id ? { ...c, status: newStatus, rejectionReason: null } : c));
  };

  const handleOpenRejectModal = (id) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const handleConfirmReject = (reason) => {
    setContents(contents.map(c => c.id === rejectingId 
      ? { ...c, status: STATUS.REJECTED, rejectionReason: reason || null } 
      : c
    ));
    setShowRejectModal(false);
    setRejectingId(null);
    alert("Soru reddedildi.");
  };

  const handleAddUser = () => { setEditingUser(null); setShowUserModal(true); };
  const handleEditUser = (user) => { setEditingUser(user); setShowUserModal(true); };
  
  const handleSaveUser = async (userData) => {
    let finalPasswordHash = userData.passwordHash;
    if (userData.password) {
        finalPasswordHash = await hashPassword(userData.password);
    }
    const userToSave = { ...userData, passwordHash: finalPasswordHash, password: undefined };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userToSave } : u));
      alert("Kullanıcı güncellendi!");
    } else {
      const newUser = { id: Date.now(), ...userToSave };
      setUsers([...users, newUser]);
      alert(`Yeni kullanıcı eklendi!`);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Kullanıcı silinecek?")) setUsers(users.filter(u => u.id !== id));
  };

  const getFilteredContents = () => {
    if (currentUser.role === ROLES.SUPER_ADMIN) return contents;
    if (currentUser.role === ROLES.ADMIN) return contents.filter(c => c.institutionId === currentUser.institutionId);
    if (currentUser.role === ROLES.LOCAL_ADMIN) return contents.filter(c => c.institutionId === currentUser.institutionId && c.departmentId === currentUser.departmentId);
    if (currentUser.role === ROLES.USER) return contents.filter(c => c.institutionId === currentUser.institutionId && c.departmentId === currentUser.departmentId);
    return [];
  };

  const getFilteredUsers = () => {
    if (currentUser.role === ROLES.SUPER_ADMIN) return users;
    if (currentUser.role === ROLES.ADMIN) return users.filter(u => u.institutionId === currentUser.institutionId);
    if (currentUser.role === ROLES.LOCAL_ADMIN) return users.filter(u => u.institutionId === currentUser.institutionId && u.departmentId === currentUser.departmentId);
    return [];
  };

  const renderContent = () => {
    const filteredDocs = getFilteredContents();
    
    const approvedCount = filteredDocs.filter(c => c.status === STATUS.PUBLISHED).length;
    const pendingCount = filteredDocs.filter(c => c.status === STATUS.PENDING || c.status === STATUS.LOCAL_APPROVED).length;
    
    const rejectedCount = filteredDocs.filter(c => c.status === STATUS.REJECTED).length;
    
    const usersCount = getFilteredUsers().length;
  
    switch (activeTab) {
      case 'anasayfa': 
        return <DashboardView 
                  currentUser={currentUser} 
                  stats={{ 
                      approved: approvedCount, 
                      pending: pendingCount, 
                      rejected: rejectedCount, 
                      users: usersCount 
                  }} 
               />;
      case 'sorular': return <QuestionsView currentUser={currentUser} data={filteredDocs} onOpenModal={() => setShowContentModal(true)} onStatusChange={handleStatusChange} onDelete={handleDeleteContent} onReject={handleOpenRejectModal} />;
      case 'kullanicilar': 
        if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN].includes(currentUser.role)) return <AccessDenied />;
        return <UsersView currentUser={currentUser} data={getFilteredUsers()} onAdd={handleAddUser} onEdit={handleEditUser} onDelete={handleDeleteUser} />;
      case 'logs': return <LogsView logs={logs} />;
      case 'profil': return <ProfileView user={currentUser} />;
      default: return null;
    }
  };

  const filteredMenuItems = SIDEBAR_ITEMS.filter(item => item.allowedRoles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-20 shadow-sm`}>
        <div className={`flex items-center justify-center border-b border-red-800 bg-red-700 text-white overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'h-44' : 'h-20'}`}>
          {isSidebarOpen ? (
            <div className="text-center animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                <img src={logo} alt="Kurum Logosu" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="font-bold text-lg tracking-wide leading-none">VERİ MERKEZİ</h1>
              <span className="text-[10px] text-red-100 opacity-80 mt-1">YÖNETİM PANELİ</span>
              <span className="text-[10px] bg-red-900 px-2 py-0.5 rounded opacity-90 block mt-2 shadow-sm border border-red-800">{currentUser.role}</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
               <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
          )}
        </div>
        <nav className="flex-1 py-6 px-2 space-y-2 overflow-y-auto overflow-x-hidden">
          {filteredMenuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} title={!isSidebarOpen?item.label:""} className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 mb-1 group ${activeTab === item.id ? 'bg-red-50 text-red-700 border-r-4 border-red-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isSidebarOpen ? 'justify-center' : ''}`}><span className={`${activeTab === item.id ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{item.icon}</span>{isSidebarOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}</button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className={`flex items-center w-full p-2 rounded-lg transition-colors text-gray-600 hover:text-red-600 hover:bg-red-50 ${!isSidebarOpen ? 'justify-center' : ''}`}><LogOut size={20} />{isSidebarOpen && <span className="ml-3 font-medium">Çıkış</span>}</button>
        </div>
      </aside>
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center"><button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 text-gray-600 mr-4 transition-colors"><Menu size={24} /></button><div><h2 className="text-xl font-bold text-gray-800">Yönetim Paneli</h2><p className="text-xs text-gray-500">{currentUser.institution}</p></div></div>
          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200"><div className="text-right hidden md:block"><p className="text-sm font-semibold text-gray-900">{currentUser.name}</p><p className="text-xs text-gray-500">{currentUser.role}</p></div><div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">{currentUser.name.charAt(0)}</div></div>
        </header>
        <div className="p-8 space-y-8">{renderContent()}</div>
      </main>
      
      {showContentModal && <ContentModal onClose={() => setShowContentModal(false)} onSave={handleSaveContent} />}
      {showUserModal && <UserModal user={editingUser} currentUser={currentUser} onClose={() => setShowUserModal(false)} onSave={handleSaveUser} />}
      {showRejectModal && <RejectModal onClose={() => setShowRejectModal(false)} onConfirm={handleConfirmReject} />}
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-100 bg-gray-50">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium text-gray-600">
        Sayfa {currentPage} / {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}


function QuestionsView({ currentUser, data, onOpenModal, onStatusChange, onDelete, onReject }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const canApprove = (content) => {
    if (currentUser.role === ROLES.LOCAL_ADMIN && content.status === STATUS.PENDING) return true;
    if (currentUser.role === ROLES.ADMIN) {
        if (content.status === STATUS.LOCAL_APPROVED) return true;
        if (content.status === STATUS.PENDING) return true; 
        if (content.status === STATUS.REJECTED) return true; 
    }
    if (currentUser.role === ROLES.SUPER_ADMIN && content.status !== STATUS.PUBLISHED) return true;
    return false;
  };

  const canDelete = (content) => { 
    if (currentUser.role === ROLES.SUPER_ADMIN) return true; 
    if (currentUser.role === ROLES.ADMIN && content.institutionId === currentUser.institutionId) return true; 
    if (currentUser.role === ROLES.LOCAL_ADMIN && content.institutionId === currentUser.institutionId && content.departmentId === currentUser.departmentId) return true; 
    if (currentUser.role === ROLES.USER && content.status === STATUS.PENDING) return true; 
    return false; 
  };
  
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Soru / Cevap Listesi</h3><button onClick={onOpenModal} className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 flex items-center"><Plus size={16} className="mr-2" /> Yeni Soru Ekle</button></div>
      <div className="overflow-x-auto p-2 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-gray-50 text-gray-600 text-xs uppercase"><th className="p-4 border-b">Kurum</th><th className="p-4 border-b">Soru</th><th className="p-4 border-b">Cevap</th><th className="p-4 border-b">Durum</th><th className="p-4 border-b text-right">İşlemler</th></tr></thead>
          <tbody className="text-sm">
            {currentData.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">Kayıt yok.</td></tr> : currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{row.institution}</td>
                <td className="p-4 font-bold text-gray-800 max-w-xs truncate">{row.question}</td>
                <td className="p-4 text-gray-600 max-w-xs truncate">
                  {row.answer}
                  {row.status === STATUS.REJECTED && row.rejectionReason && (
                    <div className="text-red-500 text-xs mt-1 flex items-center font-medium"><AlertCircle size={10} className="mr-1"/> Nedeni: {row.rejectionReason}</div>
                  )}
                </td>
                <td className="p-4"><StatusBadge status={row.status} /></td>
                <td className="p-4 text-right space-x-2">
                  {canApprove(row) && <button onClick={() => {
                      if (currentUser.role === ROLES.LOCAL_ADMIN) onStatusChange(row.id, STATUS.LOCAL_APPROVED);
                      else onStatusChange(row.id, STATUS.PUBLISHED);
                  }} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Onayla"><CheckCircle size={18}/></button>}
                  {([ROLES.LOCAL_ADMIN, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(currentUser.role) && row.status !== STATUS.REJECTED) && 
                    <button onClick={() => onReject(row.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" title="Reddet"><XCircle size={18}/></button>
                  }
                  {canDelete(row) && <button onClick={() => onDelete(row.id)} className="text-gray-400 hover:text-red-600 p-1 rounded" title="Sil"><Trash2 size={18}/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </section>
  );
}

function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-800 flex items-center text-red-600"><AlertCircle className="mr-2"/> Reddetme Nedeni</h3>
        <p className="text-sm text-gray-500">Lütfen bu soruyu neden reddettiğinizi belirtin (İsteğe bağlı).</p>
        <textarea className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" rows="3" placeholder="Reddetme nedeni..." value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">İptal</button><button onClick={() => onConfirm(reason)} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-bold">Reddet</button></div>
      </div>
    </div>
  );
}

function UsersView({ currentUser, data, onAdd, onEdit, onDelete }) {
  const canAdd = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN].includes(currentUser.role);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Kullanıcı Yönetimi</h3>{canAdd && <button onClick={onAdd} className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 flex items-center"><Plus size={16} className="mr-2" /> Kullanıcı Ekle</button>}</div>
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs"><tr><th className="p-4">Ad Soyad</th><th className="p-4">Kullanıcı Adı</th><th className="p-4">Rol</th><th className="p-4">Kurum/Dept</th><th className="p-4 text-right">İşlem</th></tr></thead>
            <tbody>
                {currentData.length === 0 ? (<tr><td colSpan="5" className="p-4 text-center text-gray-500">Kayıt yok.</td></tr>) : currentData.map(u => (<tr key={u.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{u.name} <div className="text-xs text-gray-400 font-normal">{u.email}</div></td><td className="p-4 text-gray-600">{u.username}</td><td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role}</span></td><td className="p-4 text-gray-500">{u.institution} / {u.department}</td><td className="p-4 text-right"><button onClick={() => onEdit(u)} className="text-blue-600 hover:underline mr-3">Düzenle</button>{currentUser.role === ROLES.SUPER_ADMIN && <button onClick={() => onDelete(u.id)} className="text-red-600 hover:underline">Sil</button>}</td></tr>))}
            </tbody>
        </table>
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </section>
  );
}

function UserModal({ user, currentUser, onClose, onSave }) {
  const isSuper = currentUser.role === ROLES.SUPER_ADMIN;
  const isAdmin = currentUser.role === ROLES.ADMIN;
  const isLocal = currentUser.role === ROLES.LOCAL_ADMIN;

  const initialData = user || { 
    name: '', username: '', password: '', email: '', phone: '',
    role: isLocal ? 'User' : 'User', 
    institution: !isSuper ? currentUser.institution : '',
    institutionId: !isSuper ? currentUser.institutionId : 0,
    department: isLocal ? currentUser.department : '',
    departmentId: isLocal ? currentUser.departmentId : 0
  };

  const [form, setForm] = useState(initialData);
  const [availableDepartments, setAvailableDepartments] = useState([]);

  useEffect(() => {
    if (form.institutionId) {
      const selectedInst = INSTITUTIONS_LIST.find(i => i.id === Number(form.institutionId));
      setAvailableDepartments(selectedInst ? selectedInst.departments : []);
    } else {
      setAvailableDepartments([]);
    }
  }, [form.institutionId]);

  const roleOptions = [];
  if (isSuper) roleOptions.push('Admin', 'LocalAdmin', 'User');
  if (isAdmin) roleOptions.push('LocalAdmin', 'User');
  if (isLocal) roleOptions.push('User');

  const handleInstitutionChange = (e) => {
    const instId = Number(e.target.value);
    const inst = INSTITUTIONS_LIST.find(i => i.id === instId);
    setForm({ ...form, institutionId: instId, institution: inst ? inst.name : '', departmentId: 0, department: '' });
  };

  const handleDepartmentChange = (e) => {
    const deptId = Number(e.target.value);
    const dept = availableDepartments.find(d => d.id === deptId);
    setForm({ ...form, departmentId: deptId, department: dept ? dept.name : '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white shrink-0"><h3 className="font-bold text-lg">{user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3><button onClick={onClose}><XCircle size={20} /></button></div>
        <div className="p-6 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-bold text-gray-500">Ad Soyad</label><input type="text" className="w-full border p-2 rounded mt-1 text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div><div><label className="text-xs font-bold text-gray-500">Kullanıcı Adı</label><input type="text" className="w-full border p-2 rounded mt-1 text-sm" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div></div>
          <div><label className="text-xs font-bold text-gray-500">Şifre {user && "(Boş bırakırsan değişmez)"}</label><input type="password" className="w-full border p-2 rounded mt-1 text-sm" placeholder={user ? "******" : "Şifre belirle"} value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-bold text-gray-500">E-posta</label><input type="email" className="w-full border p-2 rounded mt-1 text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div><div><label className="text-xs font-bold text-gray-500">Telefon</label><input type="text" className="w-full border p-2 rounded mt-1 text-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div></div>
          <hr className="my-2 border-gray-100" />
          <div><label className="text-xs font-bold text-gray-500">Rol (Yetki)</label><select className="w-full border p-2 rounded mt-1 text-sm" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>{roleOptions.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-bold text-gray-500">Kurum</label><select className={`w-full border p-2 rounded mt-1 text-sm ${!isSuper ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} value={form.institutionId || ''} onChange={handleInstitutionChange} disabled={!isSuper}><option value="">Seçiniz</option>{INSTITUTIONS_LIST.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
            <div><label className="text-xs font-bold text-gray-500">Departman</label><select className={`w-full border p-2 rounded mt-1 text-sm ${isLocal ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} value={form.departmentId || ''} onChange={handleDepartmentChange} disabled={isLocal || !form.institutionId}><option value="">Seçiniz</option>{availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2 border-t shrink-0"><button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm">İptal</button><button onClick={() => onSave(form)} className="px-4 py-2 bg-red-700 text-white hover:bg-red-800 rounded text-sm font-medium">Kaydet</button></div>
      </div>
    </div>
  );
}

function DashboardView({ currentUser, stats }) { 
  return (
      <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Hoşgeldiniz, {currentUser.name}</h2>
              <p className="opacity-90">Yetki: {currentUser.role}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Yayınlanan Sorular" value={stats.approved} icon={<CheckCircle size={24}/>} color="green" />
              <StatCard title="Onay Bekleyen" value={stats.pending} icon={<Clock size={24}/>} color="yellow" />
              
              <StatCard title="Reddedilen Sorular" value={stats.rejected} icon={<XCircle size={24}/>} color="red" />
              
              <StatCard title="Kullanıcılar" value={stats.users} icon={<Users size={24}/>} color="purple" />
          </div>
      </div>
  ); 
}

function LogsView({ logs }) { 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const currentData = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
        <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-4">Loglar</h3>
            <ul className="text-xs font-mono min-h-[150px]">
                {currentData.length === 0 ? <li className="text-gray-400">Log kaydı yok.</li> : currentData.map(l=><li key={l.id}>{l.date} - {l.userName}: {l.action}</li>)}
            </ul>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    ); 
}
function ContentModal({ onClose, onSave }) { const [form, setForm] = useState({ question: '', answer: '' }); return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4"><h3 className="font-bold text-lg">Yeni Soru Ekle</h3><textarea className="w-full border p-2 rounded" rows="2" placeholder="Soru" onChange={e=>setForm({...form,question:e.target.value})}/><textarea className="w-full border p-2 rounded" rows="4" placeholder="Cevap" onChange={e=>setForm({...form,answer:e.target.value})}/><div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-gray-700">İptal</button><button onClick={()=>onSave(form)} className="px-4 py-2 bg-red-700 text-white rounded">Kaydet</button></div></div></div>; }
function ProfileView({ user }) { return <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md mx-auto text-center"><div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-3xl mx-auto mb-4">{user.name.charAt(0)}</div><h2 className="text-xl font-bold">{user.name}</h2><p className="text-gray-500">{user.role}</p><div className="mt-6 text-left bg-gray-50 p-4 rounded text-sm space-y-2"><p><strong>Kurum:</strong> {user.institution}</p><p><strong>Departman:</strong> {user.department}</p><p><strong>E-posta:</strong> {user.email || 'Belirtilmemiş'}</p><p><strong>Telefon:</strong> {user.phone || 'Belirtilmemiş'}</p></div></div>; }
function AccessDenied() { return <div className="flex flex-col items-center justify-center h-96 text-center"><Shield size={64} className="text-red-300 mb-4" /><h2 className="text-2xl font-bold text-gray-800">Erişim Reddedildi</h2></div>; }
function StatCard({ title, value, icon, color }) { 
  const colors = { 
    blue: 'bg-blue-100 text-blue-600', 
    purple: 'bg-purple-100 text-purple-600', 
    yellow: 'bg-yellow-100 text-yellow-600', 
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600' 
  }; 
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
      </div>
    </div>
  ); 
}
function StatusBadge({ status }) { const s = {0:'Onay Bekliyor', 1:'Yönetici Onayında', 2:'Yayınlandı', 3:'Reddedildi'}; const c = {0:'bg-yellow-100 text-yellow-800', 1:'bg-blue-100 text-blue-800', 2:'bg-green-100 text-green-800', 3:'bg-red-100 text-red-800'}; return <span className={`px-2 py-1 rounded text-xs ${c[status]}`}>{s[status]}</span>; }