import React from 'react';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import { SIDEBAR_ITEMS } from '../constants/constants';

export default function Sidebar({ isOpen, activeTab, setActiveTab, currentUser, onLogout }) {
  const filteredMenuItems = SIDEBAR_ITEMS.filter(item => item.allowedRoles.includes(currentUser.role));

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-20'} fixed h-full z-20 shadow-sm`}>
      <div className={`flex items-center justify-center border-b border-red-800 bg-red-700 text-white overflow-hidden transition-all duration-300 ${isOpen ? 'h-44' : 'h-20'}`}>
        {isOpen ? (
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
              <img src={logo} alt="Kurum Logosu" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="font-bold text-lg tracking-wide leading-none">VERİ MERKEZİ</h1>
            <span className="text-[10px] text-red-100 opacity-80 mt-1">YÖNETİM PANELİ</span>
            <span className="text-[10px] bg-red-900 px-2 py-0.5 rounded opacity-90 block mt-2 shadow-sm border border-red-800">
              {currentUser.role}
            </span>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              title={!isOpen ? item.label : ""} 
              className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 mb-1 group ${activeTab === item.id ? 'bg-red-50 text-red-700 border-r-4 border-red-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isOpen ? 'justify-center' : ''}`}
            >
              <span className={`${activeTab === item.id ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <Icon size={20} />
              </span>
              {isOpen && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout} 
          className={`flex items-center w-full p-2 rounded-lg transition-colors text-gray-600 hover:text-red-600 hover:bg-red-50 ${!isOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-3 font-medium">Çıkış</span>}
        </button>
      </div>
    </aside>
  );
}
