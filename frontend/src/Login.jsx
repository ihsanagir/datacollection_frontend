import React, { useState, useEffect } from 'react';
import { User, Lock, ShieldCheck, Smartphone, ArrowRight, RefreshCw, Eye, EyeOff, XCircle } from 'lucide-react';
import logo from './assets/logo.png'; // Logonuzu buradan çekiyoruz

// --- YARDIMCI FONKSİYON: ŞİFRE HASHLEME ---
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Varsayılan Kullanıcılar (Eğer hafıza boşsa bunlar yüklenecek)
const DEFAULT_USERS = [
  { id: 1, username: "superadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "SuperAdmin", name: "Ahmet Yılmaz", institution: "T.C. İçişleri Bakanlığı", department: "Bilgi İşlem", institutionId: 1, departmentId: 10, email: "ahmet@gov.tr", phone: "5551112233" },
  { id: 2, username: "admin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "Admin", name: "Fatma Çelik", institution: "Emniyet Genel Müdürlüğü", department: "Yönetim", institutionId: 2, departmentId: 20, email: "fatma@egm.gov.tr", phone: "5552223344" },
  { id: 3, username: "localadmin", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "LocalAdmin", name: "Mehmet Demir", institution: "Emniyet Genel Müdürlüğü", department: "Arşiv", institutionId: 2, departmentId: 30, email: "mehmet@egm.gov.tr", phone: "5553334455" },
  { id: 4, username: "user", passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", role: "User", name: "Ali Veli", institution: "Emniyet Genel Müdürlüğü", department: "Saha Operasyon", institutionId: 2, departmentId: 40, email: "ali@egm.gov.tr", phone: "5554445566" }
];

export default function LoginPage({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ username: '', password: '', captchaInput: '', otp: '' });
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaChars, setCaptchaChars] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    refreshCaptcha();
    if (!localStorage.getItem('app_users')) {
      localStorage.setItem('app_users', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; 
    let newCode = "";
    let charArray = [];
    for (let i = 0; i < 6; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      newCode += char;
      charArray.push({
        char: char,
        rotate: Math.floor(Math.random() * 60) - 30,
        size: Math.floor(Math.random() * 14) + 24,
        offsetY: Math.floor(Math.random() * 20) - 10,
        color: `rgba(${Math.floor(Math.random()*50)}, ${Math.floor(Math.random()*50)}, ${Math.floor(Math.random()*50)}, 0.8)`,
        font: Math.random() > 0.5 ? 'font-mono' : 'font-sans'
      });
    }
    setCaptchaCode(newCode);
    setCaptchaChars(charArray);
    setFormData(prev => ({ ...prev, captchaInput: '' }));
    setError('');
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (formData.captchaInput.toUpperCase() !== captchaCode) throw new Error("Güvenlik kodu hatalı!");
      
      const hashedPassword = await hashPassword(formData.password);
      const storedUsers = JSON.parse(localStorage.getItem('app_users')) || DEFAULT_USERS;
      const user = storedUsers.find(u => u.username === formData.username && u.passwordHash === hashedPassword);

      if (!user) throw new Error("Kullanıcı adı veya şifre hatalı!");
      
      setTempUser(user);
      setStep(2);
      setTimeout(() => alert(`[SİMÜLASYON] Sayın ${user.name}, OTP Kodunuz: 123456`), 100);
    } catch (err) {
      setError(err.message);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (formData.otp === "123456") {
        if (tempUser) onLoginSuccess(tempUser); 
      } else {
        setError("Hatalı OTP kodu!");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#e30a17_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-200">
        
        {/* --- LOGO VE BAŞLIK ALANI (GÜNCELLENDİ) --- */}
        <div className="bg-gradient-to-r from-red-800 to-red-600 p-8 text-center relative flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10" style={{clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'}}></div>
          
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg z-10">
            <img src={logo} alt="Kurum Logosu" className="w-12 h-12 object-contain" />
          </div>

          <h2 className="text-white text-3xl font-bold tracking-wide relative z-10">VERİ MERKEZİ</h2>
          <p className="text-red-100 text-sm mt-2 relative z-10 font-light tracking-wider">GÜVENLİ GİRİŞ PORTALI</p>
        </div>

        <div className="p-8 pt-10">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start"><XCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} /><span>{error}</span></div>}
          
          {step === 1 && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group"><User className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Kullanıcı Adı" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required /></div>
                <div className="relative group"><Lock className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type={showPassword ? "text" : "password"} className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Şifre" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="relative h-24 flex-1 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm select-none flex items-center justify-center group cursor-pointer" onClick={refreshCaptcha} title="Yenile">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '6px 6px'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center space-x-2 z-10 w-full h-full px-4">
                      {captchaChars.map((item, index) => (
                        <span key={index} className={`${item.font} select-none`} style={{transform: `rotate(${item.rotate}deg) translateY(${item.offsetY}px) scale(${Math.random() * 0.2 + 0.9})`, fontSize: `${item.size}px`, color: item.color, fontWeight: '900', filter: 'blur(0.4px)', display: 'inline-block'}}>{item.char}</span>
                      ))}
                    </div>
                  </div>
                  <button type="button" onClick={refreshCaptcha} className="h-12 w-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-red-600 transition-all shadow-sm active:scale-95"><RefreshCw size={22} /></button>
                </div>
                <input type="text" className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-center uppercase tracking-[0.2em] font-bold text-gray-800 text-xl transition-all" placeholder="Kodu Giriniz" value={formData.captchaInput} onChange={(e) => setFormData({...formData, captchaInput: e.target.value})} required maxLength={6} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg active:scale-[0.98]">{loading ? "Doğrulanıyor..." : <>Giriş Yap <ArrowRight size={20} className="ml-2" /></>}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-8 animate-fade-in py-4">
              <div className="text-center"><div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 border-4 border-white shadow-lg"><Smartphone size={36} /></div><h3 className="text-xl font-bold text-gray-800">SMS Doğrulama</h3><p className="text-gray-500 text-sm mt-2 px-4">Telefonunuza gönderilen 6 haneli kodu giriniz.</p></div>
              <div className="flex justify-center"><input type="text" maxLength="6" className="w-full max-w-[240px] text-center text-3xl tracking-[0.3em] font-bold py-3 border-b-2 border-gray-300 focus:border-red-600 outline-none bg-transparent" placeholder="------" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/[^0-9]/g, '')})} autoFocus /></div>
              
              <div className="flex flex-col gap-3">
                
                {/* --- OTP BUTONU (DÜZELTİLDİ: Flex ve Gap ile Yan Yana) --- */}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center"
                >
                  {loading ? "Doğrulanıyor..." : (
                    <div className="flex items-center justify-center gap-2">
                        <span>Onayla ve Gir</span>
                        <ShieldCheck size={20} />
                    </div>
                  )}
                </button>

                <button type="button" onClick={() => { setStep(1); setFormData(prev => ({...prev, otp: ''})); setError(''); refreshCaptcha(); }} className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 text-sm">Giriş Ekranına Dön</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}