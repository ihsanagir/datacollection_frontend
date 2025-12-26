import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ROLES } from '../constants/constants';
import PaginationControls from '../components/common/PaginationControls';

export default function Users({ currentUser, data, onAdd, onEdit, onDelete }) {
  const canAdd = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN].includes(currentUser.role);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Kullanıcı Yönetimi</h3>
        {canAdd && (
          <button 
            onClick={onAdd} 
            className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 flex items-center"
          >
            <Plus size={16} className="mr-2" /> Kullanıcı Ekle
          </button>
        )}
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Ad Soyad</th>
              <th className="p-4">Kullanıcı Adı</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Kurum/Dept</th>
              <th className="p-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Kayıt yok.</td></tr>
            ) : (
              currentData.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    {u.name} 
                    <div className="text-xs text-gray-400 font-normal">{u.email}</div>
                  </td>
                  <td className="p-4 text-gray-600">{u.username}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role}</span>
                  </td>
                  <td className="p-4 text-gray-500">{u.institution} / {u.department}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onEdit(u)} 
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Düzenle
                    </button>
                    {currentUser.role === ROLES.SUPER_ADMIN && (
                      <button 
                        onClick={() => onDelete(u.id)} 
                        className="text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </section>
  );
}
