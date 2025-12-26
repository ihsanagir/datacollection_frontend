import React from 'react';
import { CheckCircle, Clock, XCircle, Users } from 'lucide-react';
import StatCard from '../components/common/StatCard';

export default function Dashboard({ currentUser, stats }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Hoşgeldiniz, {currentUser.name}</h2>
        <p className="opacity-90">Yetki: {currentUser.role}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Yayınlanan Sorular" value={stats.approved} icon={<CheckCircle size={24}/>} color="green" />
        <StatCard title="Onay Bekleyen" value={stats.pending} icon={<Clock size={24}/>} color="yellow" />
        <StatCard title="Reddedilen Sorular" value={stats.rejected} icon={<XCircle size={24}/>} color="red" />
        <StatCard title="Kullanıcılar" value={stats.users} icon={<Users size={24}/>} color="purple" />
      </div>
    </div>
  );
}
