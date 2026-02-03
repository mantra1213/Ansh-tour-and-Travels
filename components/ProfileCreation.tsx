import React, { useState } from 'react';
import { User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProfileCreationProps {
  onComplete: (profile: { name: string; phone: string }) => void;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const LOGO_URL = "https://res.cloudinary.com/do0t3gaf2/image/upload/v1770113085/shifter-192x192_o6c1i5.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.length >= 10) {
      setStep(2);
      setTimeout(() => {
        onComplete({ name, phone });
      }, 1500);
    }
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-xl shadow-emerald-100">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Welcome to ANSH</h2>
        <p className="text-slate-400 text-sm text-center font-medium">Setting up your premium travel experience...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col p-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12 text-center">
          <div className="relative inline-block mb-8">
            <div className="w-36 h-36 rounded-full mx-auto shadow-2xl shadow-blue-900/20 border-8 border-slate-50 flex items-center justify-center overflow-hidden bg-transparent">
              <img 
                src={LOGO_URL} 
                alt="ANSH Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-10 h-10 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg translate-x-2 -translate-y-2">
              <ShieldCheck size={20} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Create Profile
          </h1>
          <p className="text-blue-600 text-xs font-black uppercase tracking-[0.2em]">Premium Mumbai Travel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-4 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-900/5 transition-all">
              <User size={20} className="text-slate-400" />
              <input 
                required
                type="text" 
                placeholder="Jayesh Deshmukh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold w-full text-slate-800 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-4 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-900/5 transition-all">
              <Phone size={20} className="text-slate-400" />
              <input 
                required
                type="tel" 
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                className="bg-transparent outline-none text-sm font-bold w-full text-slate-800 placeholder:text-slate-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim() || phone.length < 10}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all uppercase tracking-widest mt-8"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100">
          <ShieldCheck size={16} className="text-emerald-500" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">256-bit Secure Verification</p>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-slate-300 font-medium mb-4">
        By continuing, you agree to ANSH Tours & Travels Terms of Service
      </p>
    </div>
  );
};

export default ProfileCreation;