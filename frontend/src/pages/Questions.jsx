import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PaginationControls from '../components/common/PaginationControls';
import { ROLES, STATUS } from '../constants/constants';

export default function Questions({ currentUser, data, onOpenModal, onStatusChange, onDelete, onReject }) {
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
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Soru / Cevap Listesi</h3>
        <button 
          onClick={onOpenModal} 
          className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 flex items-center"
        >
          <Plus size={16} className="mr-2" /> Yeni Soru Ekle
        </button>
      </div>
      
      <div className="overflow-x-auto p-2 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
              <th className="p-4 border-b">Kurum</th>
              <th className="p-4 border-b">Soru</th>
              <th className="p-4 border-b">Cevap</th>
              <th className="p-4 border-b">Durum</th>
              <th className="p-4 border-b text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentData.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Kayıt yok.</td></tr>
            ) : (
              currentData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 group">
                  <td className="p-4">
                    <span className="font-semibold block">{item.institution}</span>
                    <span className="text-xs text-gray-400">ID: {item.id}</span>
                  </td>
                  <td className="p-4 max-w-xs truncate" title={item.question}>{item.question}</td>
                  <td className="p-4 max-w-xs truncate" title={item.answer}>{item.answer}</td>
                  <td className="p-4">
                    <StatusBadge status={item.status} />
                    {item.status === STATUS.REJECTED && item.rejectionReason && (
                      <div className="text-xs text-red-500 mt-1 max-w-[150px]">{item.rejectionReason}</div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {canApprove(item) && (
                        <>
                          <button 
                            onClick={() => onStatusChange(item.id, currentUser.role === ROLES.LOCAL_ADMIN ? STATUS.LOCAL_APPROVED : STATUS.PUBLISHED)} 
                            title="Onayla" 
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <CheckCircle size={18}/>
                          </button>
                          <button 
                            onClick={() => onReject(item.id)} 
                            title="Reddet" 
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <XCircle size={18}/>
                          </button>
                        </>
                      )}
                      
                      {/* Düzenleme butonu şimdilik pasif veya logic eklenebilir */}
                      {/* <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18}/></button> */}
                      
                      {canDelete(item) && (
                        <button 
                          onClick={() => onDelete(item.id)} 
                          title="Sil" 
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18}/>
                        </button>
                      )}
                    </div>
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
