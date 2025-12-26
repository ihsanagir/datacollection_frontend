import React, { useState, useEffect } from 'react';
import { Building, MapPin, ChevronRight } from 'lucide-react';
import { ROLES } from '../constants/constants';

export default function Institutions({ currentUser, institutions, onAddInstitution, onAddDepartment }) {
  const [newInstName, setNewInstName] = useState("");
  const [deptForm, setDeptForm] = useState({ instId: "", name: "" });
  const isSuper = currentUser.role === ROLES.SUPER_ADMIN;

  useEffect(() => { 
    if (!isSuper) { 
      setDeptForm(prev => ({ ...prev, instId: currentUser.institutionId })); 
    } 
  }, [currentUser, isSuper]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isSuper && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Building className="mr-2 text-red-600"/> Yeni Kurum Ekle
            </h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none" 
                placeholder="Kurum Adı" 
                value={newInstName} 
                onChange={(e) => setNewInstName(e.target.value)} 
              />
              <button 
                onClick={() => { if(newInstName) { onAddInstitution(newInstName); setNewInstName(""); } }} 
                className="bg-red-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-800"
              >
                Ekle
              </button>
            </div>
          </div>
        )}

        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${!isSuper ? 'md:col-span-2' : ''}`}>
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600"/> Yeni Birim Ekle
          </h3>
          <div className="flex flex-col gap-3">
            <select 
              className={`border p-2 rounded text-sm ${!isSuper ? 'bg-gray-100 text-gray-500' : ''}`} 
              value={deptForm.instId} 
              onChange={(e) => setDeptForm({...deptForm, instId: e.target.value})} 
              disabled={!isSuper}
            >
              <option value="">Kurum Seçiniz</option>
              {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Birim Adı (Örn: İnsan Kaynakları)" 
                value={deptForm.name} 
                onChange={(e) => setDeptForm({...deptForm, name: e.target.value})} 
              />
              <button 
                onClick={() => { 
                  if(deptForm.instId && deptForm.name) { 
                    onAddDepartment(deptForm.instId, deptForm.name); 
                    setDeptForm(prev => ({...prev, name: ""})); 
                  } else { 
                    alert("Lütfen kurum ve birim adı giriniz."); 
                  } 
                }} 
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
              >
                Birim Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Mevcut Kurum ve Birimler</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map(inst => (
            <div key={inst.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-red-700 border-b pb-2 mb-2 flex items-center">
                <Building size={16} className="mr-2"/> {inst.name}
              </h4>
              <ul className="space-y-1">
                {inst.departments.length === 0 ? 
                  <li className="text-gray-400 text-xs italic">Henüz birim yok.</li> : 
                  inst.departments.map(dept => (
                    <li key={dept.id} className="text-sm text-gray-600 flex items-center">
                      <ChevronRight size={14} className="text-gray-400 mr-1"/> {dept.name}
                    </li>
                  ))
                }
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
