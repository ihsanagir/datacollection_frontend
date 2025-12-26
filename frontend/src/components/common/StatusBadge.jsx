import React from 'react';

export default function StatusBadge({ status }) {
  const s = {
    0: 'Onay Bekliyor',
    1: 'Yönetici Onayında',
    2: 'Yayınlandı',
    3: 'Reddedildi'
  };
  
  const c = {
    0: 'bg-yellow-100 text-yellow-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${c[status]}`}>
      {s[status]}
    </span>
  );
}
