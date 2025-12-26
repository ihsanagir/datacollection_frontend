import React from 'react';

export default function Profile({ user }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-3xl mx-auto mb-4">
        {user.name.charAt(0)}
      </div>
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-500">{user.role}</p>
      
      <div className="mt-6 text-left bg-gray-50 p-4 rounded text-sm space-y-2">
        <p><strong>Kurum:</strong> {user.institution}</p>
        <p><strong>Departman:</strong> {user.department}</p>
        <p><strong>E-posta:</strong> {user.email || 'Belirtilmemiş'}</p>
        <p><strong>Telefon:</strong> {user.phone || 'Belirtilmemiş'}</p>
      </div>
    </div>
  );
}
