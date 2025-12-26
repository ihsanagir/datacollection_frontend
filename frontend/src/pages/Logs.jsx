import React, { useState } from 'react';
import PaginationControls from '../components/common/PaginationControls';

export default function Logs({ logs }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const currentData = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-bold mb-4">Loglar</h3>
      <ul className="text-xs font-mono min-h-[150px]">
        {currentData.length === 0 ? (
          <li className="text-gray-400">Log kaydı yok.</li>
        ) : (
          currentData.map(l => (
            <li key={l.id}>{l.date} - {l.userName}: {l.action}</li>
          ))
        )}
      </ul>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
