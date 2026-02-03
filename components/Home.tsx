
import React from 'react';
import { 
  Search, 
  MapPin, 
  Plane, 
  TrendingUp, 
  Star,
  ChevronRight,
  Award,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface HomeProps {
  onQuickRoute: (pickup: string, drop: string) => void;
  onAirportClick: () => void;
  onSearchClick: () => void;
  userName?: string;
}

const Home: React.FC<HomeProps> = ({ onQuickRoute, onAirportClick, onSearchClick, userName = "Traveler" }) => {
  const services = [
    { label: 'Outstation', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600', desc: 'Intercity' },
    { label: 'Airport', icon: Plane, color: 'bg-blue-50 text-blue-600', desc: 'Flat Rates', action: onAirportClick },
    { label: 'Local', icon: MapPin, color: 'bg-emerald-50 text-emerald-600', desc: '8h/80km' },
    { label: 'Corporate', icon: Award, color: 'bg-amber-50 text-amber-600', desc: 'Monthly' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 -mx-4 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HERO CONCIERGE SECTION */}
      <section className="bg-white px-6 pt-6 pb-12 rounded-b-[48px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-blue-600/60 uppercase tracking-widest">Premium Travel</h2>
              <h3 className="text-3xl font-black text-slate-900 leading-tight">
                Hello, <span className="text-blue-600">{userName.split(' ')[0]}</span>
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Drivers Online</span>
            </div>
          </div>

          {/* Floating Search Card */}
          <div 
            onClick={onSearchClick}
            className="group cursor-pointer active:scale-[0.97] transition-all"
          >
            <div className="relative flex items-center gap-4 bg-slate-900 rounded-[32px] p-2 shadow-2xl shadow-blue-900/30">
              <div className="flex-1 flex items-center gap-4 pl-6 py-4">
                <Search size={24} className="text-blue-400" />
                <div>
                  <p className="text-white font-black text-lg">Where to next?</p>
                  <p className="text-slate-400 text-xs font-medium">Outstation, Airport or Local</p>
                </div>
              </div>
              <div className="bg-blue-600 p-5 rounded-[24px] text-white shadow-lg shadow-blue-600/40">
                <ChevronRight size={24} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SERVICE GRID */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-4 gap-3">
          {services.map((s, i) => (
            <button 
              key={i} 
              onClick={s.action || onSearchClick}
              className="flex flex-col items-center gap-2 bg-white p-3 rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-50 active:scale-95 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={22} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{s.label}</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US (RESTORED TRUST SECTION) */}
      <section className="px-6 pt-10">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck size={160} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="space-y-1">
              <h4 className="text-xl font-black leading-tight">Why Choose <br/> <span className="text-blue-500">ANSH Premium?</span></h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mumbai's Gold Standard</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Zap size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">No Surge Pricing</p>
                  <p className="text-[10px] text-slate-400 font-medium">Fixed transparent rates, always.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Verified Chauffeurs</p>
                  <p className="text-[10px] text-slate-400 font-medium">Background checked & professional.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Elite Service</p>
                  <p className="text-[10px] text-slate-400 font-medium">Spotless cars with premium interiors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS & FOOTER */}
      <section className="px-6 pt-10 pb-12 space-y-8">
        <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center">
             <Star size={28} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 font-medium italic leading-relaxed">"Best cab service in Mumbai. Very professional drivers and clean cars always."</p>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider mt-2">— Sameer K, Borivali</p>
          </div>
        </div>

        <div className="text-center space-y-2 opacity-30 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">ANSH Tours & Travels</p>
          <p className="text-[8px] font-bold text-slate-500 uppercase">Registered Luxury Travel Partner • Since 2018</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
