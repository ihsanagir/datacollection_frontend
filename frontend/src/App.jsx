import React, { useState, useEffect } from 'react';
import LoginPage from './Login';

import { ROLES, STATUS, INITIAL_INSTITUTIONS, DEFAULT_USERS, INITIAL_CONTENTS } from './constants/constants';

import AccessDenied from './components/common/AccessDenied';
import ContentModal from './components/modals/ContentModal';
import UserModal from './components/modals/UserModal';
import RejectModal from './components/modals/RejectModal';

import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Users from './pages/Users';
import Institutions from './pages/Institutions';
import Logs from './pages/Logs';
import Profile from './pages/Profile';

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('anasayfa');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const [contents, setContents] = useState(INITIAL_CONTENTS);
  
  const [institutions, setInstitutions] = useState(() => {
    try {
      const saved = localStorage.getItem('app_institutions');
      return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
    } catch (error) {
      console.error("Error parsing institutions from localStorage:", error);
      return INITIAL_INSTITUTIONS;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('app_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (error) {
      console.error("Error parsing users from localStorage:", error);
      return DEFAULT_USERS;
    }
  });

  const [logs, setLogs] = useState([]);
  
  const [showContentModal, setShowContentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('app_institutions', JSON.stringify(institutions)); }, [institutions]);

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

  const handleBatchSaveContent = (dataArray) => {
    let initialStatus = STATUS.PENDING;
    if (currentUser.role === ROLES.LOCAL_ADMIN) initialStatus = STATUS.LOCAL_APPROVED;
    else if (currentUser.role === ROLES.ADMIN || currentUser.role === ROLES.SUPER_ADMIN) initialStatus = STATUS.PUBLISHED;

    const newItems = dataArray.map((row, index) => ({
      id: Date.now() + index, 
      institutionId: currentUser.institutionId || 0,
      departmentId: currentUser.departmentId || 0,
      institution: currentUser.institution || "Bilinmeyen",
      question: row.question,
      answer: row.answer,
      status: initialStatus,
      rejectionReason: null
    }));

    setContents([...newItems, ...contents]); 
    setShowContentModal(false);
    alert(`${newItems.length} adet soru başarıyla yüklendi!`);
  };

  const handleDeleteContent = (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) setContents(prev => prev.filter(c => c.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setContents(contents.map(c => c.id === id ? { ...c, status: newStatus, rejectionReason: null } : c));
  };

  const handleOpenRejectModal = (id) => { setRejectingId(id); setShowRejectModal(true); };
  const handleConfirmReject = (reason) => {
    setContents(contents.map(c => c.id === rejectingId ? { ...c, status: STATUS.REJECTED, rejectionReason: reason || null } : c));
    setShowRejectModal(false); setRejectingId(null); alert("Soru reddedildi.");
  };

  const handleAddUser = () => { setEditingUser(null); setShowUserModal(true); };
  const handleEditUser = (user) => { setEditingUser(user); setShowUserModal(true); };
  const handleSaveUser = async (userData) => {
    let finalPasswordHash = userData.passwordHash;
    if (userData.password) finalPasswordHash = await hashPassword(userData.password);
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
  const handleDeleteUser = (id) => { if (window.confirm("Kullanıcı silinecek?")) setUsers(users.filter(u => u.id !== id)); };
  
  const handleAddInstitution = (name) => { setInstitutions([...institutions, { id: Date.now(), name: name, departments: [] }]); alert("Kurum eklendi!"); };
  const handleAddDepartment = (instId, deptName) => {
    setInstitutions(institutions.map(inst => inst.id === Number(instId) ? { ...inst, departments: [...inst.departments, { id: Date.now(), name: deptName }] } : inst));
    alert("Birim eklendi!");
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
        return <Dashboard currentUser={currentUser} stats={{ approved: approvedCount, pending: pendingCount, rejected: rejectedCount, users: usersCount }} />;
      case 'sorular': 
        return <Questions 
          currentUser={currentUser} 
          data={filteredDocs} 
          onOpenModal={() => setShowContentModal(true)} 
          onStatusChange={handleStatusChange} 
          onDelete={handleDeleteContent} 
          onReject={handleOpenRejectModal} 
        />;
      case 'kullanicilar': 
        if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN].includes(currentUser.role)) return <AccessDenied />;
        return <Users currentUser={currentUser} data={getFilteredUsers()} onAdd={handleAddUser} onEdit={handleEditUser} onDelete={handleDeleteUser} />;
      case 'kurum-yonetimi':
        if (![ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(currentUser.role)) return <AccessDenied />;
        return <Institutions currentUser={currentUser} institutions={institutions} onAddInstitution={handleAddInstitution} onAddDepartment={handleAddDepartment} />;
      case 'logs': 
        return <Logs logs={logs} />;
      case 'profil': 
        return <Profile user={currentUser} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          currentUser={currentUser} 
        />
        
        <div className="p-8 space-y-8">
          {renderContent()}
        </div>
      </main>
      
      {showContentModal && (
        <ContentModal 
          onClose={() => setShowContentModal(false)} 
          onSave={handleSaveContent} 
          onBatchSave={handleBatchSaveContent} 
        />
      )}
      
      {showUserModal && (
        <UserModal 
          user={editingUser} 
          currentUser={currentUser} 
          institutionsList={institutions} 
          onClose={() => setShowUserModal(false)} 
          onSave={handleSaveUser} 
        />
      )}
      
      {showRejectModal && (
        <RejectModal 
          onClose={() => setShowRejectModal(false)} 
          onConfirm={handleConfirmReject} 
        />
      )}
    </div>
  );
}
