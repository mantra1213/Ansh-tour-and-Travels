
import React from 'react';
import { 
  Search, 
  MapPin, 
  Plane, 
  Heart, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Star,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { COLORS, TOUR_PACKAGES } from '../constants';

interface HomeProps {
  onQuickRoute: (pickup: string, drop: string) => void;
  onAirportClick: () => void;
  onSearchClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onQuickRoute, onAirportClick, onSearchClick }) => {
  const quickRides = [
    { label: 'Airport', icon: Plane, color: 'bg-blue-50 text-blue-600', route: () => onAirportClick() },
    { label: 'Pune', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600', route: () => onQuickRoute('Mumbai', 'Pune') },
    { label: 'Shirdi', icon: Heart, color: 'bg-orange-50 text-orange-600', route: () => onQuickRoute('Mumbai', 'Shirdi') },
    { label: 'Local', icon: MapPin, color: 'bg-purple-50 text-purple-600', route: () => onQuickRoute('Mumbai', 'Mumbai Sightseeing') },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] animate-in fade-in duration-700">
      {/* 60% HERO SECTION: Search & Interactive Feel */}
      <section className="h-[55vh] flex flex-col justify-center relative -mx-4 px-6 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
        {/* Subtle Map Background Decor */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">124 Drivers Nearby</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Where to <span className="text-blue-600">next?</span>
            </h2>
          </div>

          {/* Massive Search Bar (Interactive) */}
          <div 
            onClick={onSearchClick}
            className="relative group cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-3xl group-hover:bg-blue-600/10 transition-all" />
            <div className="relative flex flex-col bg-white rounded-[32px] p-2 shadow-2xl shadow-blue-900/10 border border-slate-100">
              <div className="flex items-center gap-4 px-4 py-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-600" />
                  <div className="w-0.5 h-4 bg-slate-100" />
                  <Navigation size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                   <p className="text-lg font-semibold text-slate-300">Enter destination...</p>
                </div>
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                  <Search size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                4.9
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Trusted by <span className="text-slate-900">10k+ pilgrims</span>
            </p>
          </div>
        </div>
      </section>

      {/* 20% QUICK ACTIONS: Horizontal Carousel */}
      <section className="h-[18vh] py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Quick Access</h3>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {quickRides.map((ride, idx) => {
            const Icon = ride.icon;
            return (
              <button 
                key={idx}
                onClick={ride.route}
                className="flex flex-col items-center min-w-[80px] group"
              >
                <div className={`w-16 h-16 rounded-[24px] ${ride.color} flex items-center justify-center mb-2 shadow-sm transition-all group-active:scale-90 group-hover:shadow-md border border-white`}>
                  <Icon size={24} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">{ride.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 20% BOTTOM FEED: Trust, Deals & Testimonials */}
      <section className="flex-1 space-y-6 pt-4 pb-8">
        {/* Deal Card */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">Exclusive Deal</span>
            <h4 className="text-xl font-bold mb-1">Mumbai-Pune Express</h4>
            <p className="text-xs text-slate-400 mb-4 font-medium">Flat ₹2500 for First Trip</p>
            <button className="bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tight">Claim Now</button>
          </div>
          <TrendingUp size={120} className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" />
        </div>

        {/* Testimonial Strip */}
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-5 flex items-start gap-4 shadow-sm">
          <img 
            src="https://i.pravatar.cc/100?img=32" 
            alt="Priya" 
            className="w-12 h-12 rounded-2xl object-cover grayscale brightness-110 border border-white"
          />
          <div className="space-y-1">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              "Loved the safe Shirdi trip! Driver was professional and the car was spotless. Highly recommend ANSH for families."
            </p>
            <p className="text-[10px] font-bold text-slate-900">— Priya, Mumbai</p>
          </div>
        </div>

        {/* Upsell: Wedding/Event */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-[28px] p-4 flex flex-col items-center text-center group active:bg-slate-50 transition-colors">
            <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
              <Heart size={20} />
            </div>
            <h5 className="text-[11px] font-black uppercase tracking-tight">Wedding Car</h5>
            <p className="text-[9px] text-slate-400">Luxury Chauffeurs</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-[28px] p-4 flex flex-col items-center text-center group active:bg-slate-50 transition-colors">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <h5 className="text-[11px] font-black uppercase tracking-tight">Corporate</h5>
            <p className="text-[9px] text-slate-400">Monthly Billing</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
