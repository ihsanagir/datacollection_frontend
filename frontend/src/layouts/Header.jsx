import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ isOpen, toggleSidebar, currentUser }) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 mr-4 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Yönetim Paneli</h2>
          <p className="text-xs text-gray-500">{currentUser.institution}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{currentUser.role}</p>
        </div>
        <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
