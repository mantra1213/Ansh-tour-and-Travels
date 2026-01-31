
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import BookingFlow from './components/BookingFlow';
import ChatExpert from './components/ChatExpert';
import ProfileCreation from './components/ProfileCreation';
import { 
  History, 
  Wallet, 
  Settings, 
  LogOut, 
  Star,
  Globe,
  Plane,
  ChevronRight as ChevronRightIcon,
  ShieldCheck as ShieldCheckIcon,
  MapPin,
  Clock,
  ArrowRight,
  PlaneLanding,
  PlaneTakeoff,
  Download
} from 'lucide-react';

interface UserProfile {
  name: string;
  phone: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [bookingInit, setBookingInit] = useState<{ p: string; d: string } | null>(null);
  const [airportDirection, setAirportDirection] = useState<'from' | 'to'>('from');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ansh_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    setIsLoaded(true);

    // Capture install prompt for Play Store feel
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleProfileComplete = (profile: UserProfile) => {
    localStorage.setItem('ansh_user_profile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  const handleSignOut = () => {
    localStorage.removeItem('ansh_user_profile');
    setUserProfile(null);
    setActiveTab('home');
  };

  const handleQuickRoute = (p: string, d: string) => {
    setBookingInit({ p, d });
    setActiveTab('book');
  };

  const handleWhatsAppConfirm = (data: any) => {
    const phoneNumber = "918850351310";
    const message = `*ANSH Tours & Travels Booking Request*%0A%0A` +
      `*Customer Name:* ${data.name}%0A` +
      `*Customer Phone:* ${data.phone}%0A%0A` +
      `*Pickup:* ${data.pickup}%0A` +
      `*Drop:* ${data.drop}%0A` +
      `*Vehicle:* ${data.vehicle?.name}%0A` +
      `*Distance:* ${data.distance} KM%0A` +
      `*Estimated Fare:* ₹${data.fare}%0A%0A` +
      `Please confirm my booking.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setActiveTab('trips');
  };

  if (!isLoaded) return null;

  if (!userProfile) {
    return <ProfileCreation onComplete={handleProfileComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            onQuickRoute={handleQuickRoute} 
            onAirportClick={() => setActiveTab('airport')} 
            onSearchClick={() => setActiveTab('book')}
          />
        );
      case 'book':
        return (
          <BookingFlow 
            initialPickup={bookingInit?.p} 
            initialDrop={bookingInit?.d} 
            onConfirm={handleWhatsAppConfirm}
            userProfile={userProfile}
          />
        );
      case 'trips':
        return (
          <div className="space-y-6 pt-4 animate-in fade-in">
            <h2 className="text-xl font-bold">My Trips</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center">
              <History size={48} className="text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-blue-900 mb-1">Check WhatsApp</h3>
              <p className="text-xs text-blue-700 mb-4">Your request has been sent! Our team will confirm the driver details on WhatsApp shortly.</p>
              <button 
                onClick={() => setActiveTab('book')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                Book Another Trip
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recent Requests</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center opacity-60">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <Star size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Mumbai Local</h4>
                  <p className="text-[10px] text-gray-400">Just now • Pending Confirmation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">Sent</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'airport':
        const commonDestinations = [
          { name: 'South Mumbai', price: '₹899', duration: '40-50 mins' },
          { name: 'Navi Mumbai', price: '₹999', duration: '45-60 mins' },
          { name: 'Thane', price: '₹1,299', duration: '60-80 mins' },
          { name: 'Badlapur', price: '₹1,599', duration: '90-120 mins' },
        ];

        return (
          <div className="space-y-6 pt-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Airport Transfers</h2>
              <span className="text-[10px] font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full tracking-widest">PREMIUM T1/T2</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setAirportDirection('from')}
                className={`p-5 rounded-[28px] border-2 transition-all flex flex-col items-center text-center gap-3 ${
                  airportDirection === 'from' 
                    ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100' 
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className={`p-3 rounded-2xl ${airportDirection === 'from' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                  <PlaneLanding size={24} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-tight">Pickup from</h3>
                  <p className="text-[10px] text-slate-500 font-bold">Mumbai Airport</p>
                </div>
              </button>

              <button 
                onClick={() => setAirportDirection('to')}
                className={`p-5 rounded-[28px] border-2 transition-all flex flex-col items-center text-center gap-3 ${
                  airportDirection === 'to' 
                    ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100' 
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className={`p-3 rounded-2xl ${airportDirection === 'to' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                  <PlaneTakeoff size={24} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-tight">Drop to</h3>
                  <p className="text-[10px] text-slate-500 font-bold">Mumbai Airport</p>
                </div>
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">
                  {airportDirection === 'from' ? 'Welcome to Mumbai' : 'Safe Flights'}
                </span>
                <h3 className="text-lg font-bold mb-1">
                  {airportDirection === 'from' ? 'Arriving at T1 or T2?' : 'Going to T1 or T2?'}
                </h3>
                <p className="text-xs text-slate-300 font-medium">No surge pricing, professional chauffeurs, 100% reliable.</p>
              </div>
              <Plane size={100} className="absolute -right-4 -bottom-4 opacity-10 -rotate-12" />
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-blue-600" /> 
                {airportDirection === 'from' ? 'Popular Destinations' : 'Common Pickup Points'}
              </h3>
              
              {commonDestinations.map((dest, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (airportDirection === 'from') handleQuickRoute('Airport', dest.name);
                    else handleQuickRoute(dest.name, 'Airport');
                  }}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{dest.name}</h4>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                          <Clock size={10} /> {dest.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-lg font-black text-blue-900">{dest.price}</div>
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        const initials = userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        return (
          <div className="space-y-8 pt-4 animate-in fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-4 relative">
                <span className="text-3xl font-black text-blue-600">{initials}</span>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                  <ShieldCheckIcon size={14} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-xs text-gray-400 font-medium">{userProfile.phone}</p>
              <div className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                Verified Premium User
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm divide-y divide-gray-50">
              {deferredPrompt && (
                <div onClick={handleInstallClick} className="py-4 flex justify-between items-center group cursor-pointer text-blue-600">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl"><Download size={20} /></div>
                    <div>
                      <h4 className="text-sm font-bold">Download App</h4>
                      <p className="text-[10px] text-blue-400">Install for a faster experience</p>
                    </div>
                  </div>
                  <ArrowRight size={18} />
                </div>
              )}
              <div className="py-4 flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Wallet size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold">Wallet Balance</h4>
                    <p className="text-[10px] text-gray-400">Total Credits: ₹150</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">Top Up</button>
              </div>
              <div className="py-4 flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600"><Globe size={20} /></div>
                  <div>
                    <h4 className="text-sm font-bold">Language</h4>
                    <p className="text-[10px] text-gray-400">Current: English</p>
                  </div>
                </div>
                <ChevronRightIcon size={18} className="text-gray-300" />
              </div>
              <div className="py-4 flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600"><Settings size={20} /></div>
                  <h4 className="text-sm font-bold">Settings</h4>
                </div>
                <ChevronRightIcon size={18} className="text-gray-300" />
              </div>
              <div onClick={handleSignOut} className="py-4 flex justify-between items-center text-red-600 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-red-50 rounded-xl"><LogOut size={20} /></div>
                  <h4 className="text-sm font-bold">Sign Out</h4>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Home 
            onQuickRoute={handleQuickRoute} 
            onAirportClick={() => setActiveTab('airport')} 
            onSearchClick={() => setActiveTab('book')}
          />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setBookingInit(null);
        setActiveTab(tab);
      }}
      onSupportClick={() => setShowChat(true)}
    >
      {renderContent()}
      {showChat && <ChatExpert onClose={() => setShowChat(false)} />}
    </Layout>
  );
};

export default App;
