import React, { useState, useEffect } from 'react';
import { XCircle, Save } from 'lucide-react';
import { ROLES } from '../../constants/constants';

export default function UserModal({ user, currentUser, institutionsList, onClose, onSave }) {
  const isSuper = currentUser.role === ROLES.SUPER_ADMIN;
  const isAdmin = currentUser.role === ROLES.ADMIN;
  const isLocal = currentUser.role === ROLES.LOCAL_ADMIN;

  const initialData = user || { 
    name: '', 
    username: '', 
    password: '', 
    email: '', 
    phone: '', 
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
      const selectedInst = institutionsList.find(i => i.id === Number(form.institutionId)); 
      setAvailableDepartments(selectedInst ? selectedInst.departments : []); 
    } else { 
      setAvailableDepartments([]); 
    } 
  }, [form.institutionId, institutionsList]);

  const roleOptions = []; 
  if (isSuper) roleOptions.push('Admin', 'LocalAdmin', 'User'); 
  if (isAdmin) roleOptions.push('LocalAdmin', 'User'); 
  if (isLocal) roleOptions.push('User');

  const handleInstitutionChange = (e) => { 
    const instId = Number(e.target.value); 
    const inst = institutionsList.find(i => i.id === instId); 
    setForm({ 
      ...form, 
      institutionId: instId, 
      institution: inst ? inst.name : '', 
      departmentId: 0, 
      department: '' 
    }); 
  };

  const handleDepartmentChange = (e) => { 
    const deptId = Number(e.target.value); 
    const dept = availableDepartments.find(d => d.id === deptId); 
    setForm({ 
      ...form, 
      departmentId: deptId, 
      department: dept ? dept.name : '' 
    }); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg">{user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
          <button onClick={onClose}><XCircle size={20} className="hover:text-red-400 transition-colors"/></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Ad Soyad</label>
            <input className="w-full border p-2 rounded text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ad Soyad" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Kullanıcı Adı</label>
                <input className="w-full border p-2 rounded text-sm" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Kullanıcı Adı" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Şifre</label>
                <input className="w-full border p-2 rounded text-sm" type="password" value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} placeholder={user ? "Boş bırakılırsa değişmez" : "Şifre"} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">E-posta</label>
                <input className="w-full border p-2 rounded text-sm" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} placeholder="E-posta" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                <input className="w-full border p-2 rounded text-sm" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Telefon" />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-gray-500 uppercase">Rol</label>
             <select className="w-full border p-2 rounded text-sm bg-white" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase">Kurum</label>
               <select className="w-full border p-2 rounded text-sm bg-white" value={form.institutionId} onChange={handleInstitutionChange} disabled={!isSuper}>
                  <option value={0}>Seçiniz</option>
                  {institutionsList.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
               </select>
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase">Birim</label>
               <select className="w-full border p-2 rounded text-sm bg-white" value={form.departmentId} onChange={handleDepartmentChange} disabled={isLocal || availableDepartments.length === 0}>
                  <option value={0}>Seçiniz</option>
                  {availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
               </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100 font-medium">İptal</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium flex items-center">
            <Save size={16} className="mr-2" /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
