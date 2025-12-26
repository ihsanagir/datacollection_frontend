import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-800 flex items-center text-red-600">
          <AlertCircle className="mr-2"/> Reddetme Nedeni
        </h3>
        <p className="text-sm text-gray-500">
          Lütfen bu soruyu neden reddettiğinizi belirtin (İsteğe bağlı).
        </p>
        <textarea 
          className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" 
          rows="3" 
          placeholder="Reddetme nedeni..." 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
            İptal
          </button>
          <button onClick={() => onConfirm(reason)} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-bold">
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
