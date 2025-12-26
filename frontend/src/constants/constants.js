import { Home, MessageCircle, Users, Building, Activity, User } from 'lucide-react';

export const ROLES = { 
  SUPER_ADMIN: 'SuperAdmin', 
  ADMIN: 'Admin', 
  LOCAL_ADMIN: 'LocalAdmin', 
  USER: 'User' 
};

export const STATUS = { 
  PENDING: 0, 
  LOCAL_APPROVED: 1, 
  PUBLISHED: 2, 
  REJECTED: 3 
};

export const INITIAL_INSTITUTIONS = [
  { id: 1, name: "T.C. İçişleri Bakanlığı", departments: [ { id: 10, name: "Bilgi İşlem" }, { id: 11, name: "Personel Daire Bşk." } ] },
  { id: 2, name: "Emniyet Genel Müdürlüğü", departments: [ { id: 20, name: "Yönetim" }, { id: 30, name: "Arşiv" }, { id: 40, name: "Saha Operasyon" } ] }
];

export const DEFAULT_USERS = [
  { id: 1, username: "superadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "SuperAdmin", name: "Ahmet Yılmaz", institution: "T.C. İçişleri Bakanlığı", department: "Bilgi İşlem", institutionId: 1, departmentId: 10, email: "ahmet@gov.tr", phone: "5551112233" },
  { id: 2, username: "admin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "Admin", name: "Fatma Çelik", institution: "Emniyet Genel Müdürlüğü", department: "Yönetim", institutionId: 2, departmentId: 20, email: "fatma@egm.gov.tr", phone: "5552223344" },
  { id: 3, username: "localadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "LocalAdmin", name: "Mehmet Demir", institution: "Emniyet Genel Müdürlüğü", department: "Arşiv", institutionId: 2, departmentId: 30, email: "mehmet@egm.gov.tr", phone: "5553334455" },
  { id: 4, username: "user", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "User", name: "Ali Veli", institution: "Emniyet Genel Müdürlüğü", department: "Saha Operasyon", institutionId: 2, departmentId: 40, email: "ali@egm.gov.tr", phone: "5554445566" }
];

export const INITIAL_CONTENTS = [
  { id: 101, institutionId: 1, departmentId: 10, institution: "İçişleri Bakanlığı", question: "Sunucu bakımı ne zaman yapılacak?", answer: "Bu hafta sonu planlanmıştır.", status: STATUS.PUBLISHED, rejectionReason: null },
  { id: 102, institutionId: 2, departmentId: 40, institution: "Emniyet Genel Müdürlüğü", question: "Saha ekiplerine tablet dağıtımı başladı mı?", answer: "Henüz tedarik aşamasında.", status: STATUS.PENDING, rejectionReason: null },
  { id: 103, institutionId: 2, departmentId: 30, institution: "Emniyet Genel Müdürlüğü", question: "Arşiv dijitalleştirme süreci yüzde kaçta?", answer: "%45 oranında tamamlandı.", status: STATUS.LOCAL_APPROVED, rejectionReason: null },
];

export const SIDEBAR_ITEMS = [
  { id: 'anasayfa', label: 'Ana Sayfa', icon: Home, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
  { id: 'sorular', label: 'Sorular / Cevaplar', icon: MessageCircle, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
  { id: 'kullanicilar', label: 'Kullanıcılar', icon: Users, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN] },
  { id: 'kurum-yonetimi', label: 'Kurum/Birim', icon: Building, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { id: 'logs', label: 'Sistem Kayıtları', icon: Activity, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { id: 'profil', label: 'Profilim', icon: User, allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.LOCAL_ADMIN, ROLES.USER] },
];