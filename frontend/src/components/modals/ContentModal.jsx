import React, { useState, useRef } from 'react';
import { XCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ContentModal({ onClose, onSave, onBatchSave }) {
  const [form, setForm] = useState({ question: '', answer: '' });
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const formattedData = [];
      data.forEach((row) => {
        if (row[0] && row[1]) { 
           if(row[0] !== "Soru" && row[0] !== "Question") {
             formattedData.push({ question: row[0], answer: row[1] });
           }
        }
      });

      if (formattedData.length > 0) {
        onBatchSave(formattedData);
      } else {
        alert("Excel dosyasında uygun veri bulunamadı. (A Sütunu: Soru, B Sütunu: Cevap olmalı)");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Yeni Soru Ekle</h3>
            <button onClick={onClose}><XCircle size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        
        <textarea 
          className="w-full border p-2 rounded text-sm" 
          rows="2" 
          placeholder="Soru" 
          onChange={e=>setForm({...form,question:e.target.value})}
        />
        <textarea 
          className="w-full border p-2 rounded text-sm" 
          rows="4" 
          placeholder="Cevap" 
          onChange={e=>setForm({...form,answer:e.target.value})}
        />
        
        <div className="flex items-center justify-between border-t pt-4">
            <div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".xlsx, .xls"
                />
                <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center text-green-700 hover:text-green-800 text-sm font-medium transition-colors"
                    title="Excel formatı: A Sütunu Soru, B Sütunu Cevap"
                >
                    <FileSpreadsheet size={20} className="mr-2"/> Excel'den Yükle
                </button>
            </div>

            <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded">İptal</button>
                <button onClick={()=>onSave(form)} className="px-4 py-2 bg-red-700 text-white rounded text-sm hover:bg-red-800">Kaydet</button>
            </div>
        </div>
      </div>
    </div>
  );
}
