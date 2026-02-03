
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import BookingFlow from './components/BookingFlow';
import ChatExpert from './components/ChatExpert';
import ProfileCreation from './components/ProfileCreation';
import { 
  History, 
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
  Download,
  Calendar,
  Car,
  CheckCircle2
} from 'lucide-react';

interface UserProfile {
  name: string;
  phone: string;
}

interface SavedBooking {
  id: string;
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  vehicleName: string;
  fare: number;
  distance: number;
  date: string;
  status: 'Pending' | 'Confirmed';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [bookingInit, setBookingInit] = useState<{ p: string; d: string } | null>(null);
  const [airportDirection, setAirportDirection] = useState<'from' | 'to'>('from');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ansh_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUserProfile(parsed);
      
      // Load bookings specific to this phone number
      const allBookings = JSON.parse(localStorage.getItem('ansh_bookings') || '[]');
      const userBookings = allBookings.filter((b: SavedBooking) => b.phone === parsed.phone);
      setBookings(userBookings);
    }
    setIsLoaded(true);

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
    
    // Load bookings for this new profile
    const allBookings = JSON.parse(localStorage.getItem('ansh_bookings') || '[]');
    setBookings(allBookings.filter((b: SavedBooking) => b.phone === profile.phone));
  };

  const handleSignOut = () => {
    localStorage.removeItem('ansh_user_profile');
    setUserProfile(null);
    setBookings([]);
    setActiveTab('home');
  };

  const handleQuickRoute = (p: string, d: string) => {
    setBookingInit({ p, d });
    setActiveTab('book');
  };

  const handleWhatsAppConfirm = (data: any) => {
    const newBooking: SavedBooking = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      phone: data.phone,
      pickup: data.pickup,
      drop: data.drop,
      vehicleName: data.vehicle?.name || 'Cab',
      fare: data.fare,
      distance: data.distance,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };

    const allBookings = JSON.parse(localStorage.getItem('ansh_bookings') || '[]');
    const updatedAll = [newBooking, ...allBookings];
    localStorage.setItem('ansh_bookings', JSON.stringify(updatedAll));
    setBookings(prev => [newBooking, ...prev]);

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
            userName={userProfile?.name}
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
          <div className="space-y-6 pt-4 animate-in fade-in pb-10">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-none">My Trips</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">Booked on {userProfile.phone}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-[32px] p-10 text-center space-y-4 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <History size={40} className="text-slate-200" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-lg">No trips found</h3>
                  <p className="text-xs text-slate-400">You haven't booked any cabs yet.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('book')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                  Book Your First Ride
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Car size={24} />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{booking.date}</p>
                          <h4 className="font-bold text-slate-800">{booking.vehicleName}</h4>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <p className="text-xs font-bold text-slate-600 line-clamp-1">{booking.pickup}</p>
                          </div>
                          <div className="w-0.5 h-3 bg-slate-100 ml-0.5" />
                          <div className="flex items-center gap-3">
                            <MapPin size={10} className="text-blue-600" />
                            <p className="text-xs font-bold text-slate-600 line-clamp-1">{booking.drop}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Distance</p>
                              <p className="text-xs font-black text-slate-800">{booking.distance} KM</p>
                            </div>
                            <div className="w-px h-6 bg-slate-100" />
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Fare</p>
                              <p className="text-xs font-black text-blue-600">₹{booking.fare}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(`https://wa.me/918850351310?text=I'd like an update on my booking ID ${booking.id}`, '_blank')}
                            className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
              <div className="relative z-10 space-y-2">
                <CheckCircle2 size={32} className="text-blue-300 mb-2" />
                <h3 className="text-xl font-bold leading-tight">Need help with <br/> existing trips?</h3>
                <p className="text-xs text-blue-100">Our concierge is available 24/7 on WhatsApp for route changes or driver details.</p>
                <button 
                  onClick={() => window.open('https://wa.me/918850351310', '_blank')}
                  className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                >
                  Contact Support
                </button>
              </div>
              <Plane size={140} className="absolute -right-8 -bottom-8 opacity-10 -rotate-12" />
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
            userName={userProfile?.name}
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
