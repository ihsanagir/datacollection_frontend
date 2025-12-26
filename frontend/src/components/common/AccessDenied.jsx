import React from 'react';
import { Shield } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <Shield size={64} className="text-red-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Erişim Reddedildi</h2>
    </div>
  );
}
