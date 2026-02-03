
import React from 'react';
import { 
  Home as HomeIcon, 
  MapPin, 
  Calendar, 
  Plane, 
  User, 
  MessageSquare,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSupportClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onSupportClick }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'book', icon: MapPin, label: 'Book' },
    { id: 'trips', icon: Calendar, label: 'My Trips' },
    { id: 'airport', icon: Plane, label: 'Airport' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const LOGO_URL = "https://res.cloudinary.com/do0t3gaf2/image/upload/v1769845646/Whisk_fc5b38ea3100484abcf41f72883e154ddr-Photoroom_euuchp.jpg";

  const handleTabChange = (id: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setActiveTab(id);
  };

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        {/* Premium Header */}
        <header className="px-6 pt-[env(safe-area-inset-top,20px)] pb-3 bg-white/95 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-full shadow-lg shadow-blue-900/10 overflow-hidden flex items-center justify-center bg-transparent border-2 border-slate-50 transition-transform group-active:scale-95">
                <img 
                  src={LOGO_URL} 
                  alt="ANSH Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-slate-900">
                ANSH
              </h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-blue-600 font-black">Tours & Travels</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onSupportClick}
              className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 shadow-sm active:scale-90"
            >
              <MessageSquare size={18} />
            </button>
            <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 shadow-sm active:scale-90">
              <ShieldCheck size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 no-scrollbar">
          {children}
        </main>

        {/* Floating WhatsApp Support */}
        <button 
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(20);
            window.open('https://wa.me/918850351310', '_blank');
          }}
          className="fixed bottom-24 right-4 md:right-[calc(50%-180px)] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-200 hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
          title="WhatsApp Support"
        >
          <PhoneCall size={24} />
        </button>

        {/* Premium Bottom Nav */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 pt-4 pb-[env(safe-area-inset-bottom,20px)] flex justify-between items-center z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-blue-600 scale-105' : 'text-slate-400'
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-blue-50 shadow-inner translate-y-[-2px]' : 'bg-transparent'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
