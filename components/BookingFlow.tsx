
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Info,
  Loader2,
  Navigation,
  Activity,
  MessageSquare,
  User,
  Phone
} from 'lucide-react';
import { VEHICLES, PRESET_LOCATIONS } from '../constants';
import { Vehicle, LocationData } from '../types';

interface BookingFlowProps {
  initialPickup?: string;
  initialDrop?: string;
  onConfirm: (booking: any) => void;
  userProfile?: { name: string; phone: string } | null;
}

const LocationInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (loc: LocationData) => void;
  placeholder: string;
  icon: React.ReactNode;
}> = ({ label, value, onChange, onSelect, placeholder, icon }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Maharashtra'
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    const timeoutId = setTimeout(() => fetchSuggestions(val), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="relative space-y-1" ref={dropdownRef}>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowDropdown(true)}
          placeholder={placeholder} 
          className="w-full text-sm font-semibold outline-none border-b border-gray-100 pb-2 focus:border-blue-500 transition-colors bg-transparent"
        />
        {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                const shortName = item.display_name.split(',')[0] + ', ' + (item.address?.suburb || item.address?.city || '');
                onSelect({
                  name: item.display_name,
                  lat: item.lat,
                  lon: item.lon
                });
                onChange(shortName);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
            >
              <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.display_name.split(',')[0]}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1">{item.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingFlow: React.FC<BookingFlowProps> = ({ initialPickup = '', initialDrop = '', onConfirm, userProfile }) => {
  const [step, setStep] = useState(1);
  const [pickupText, setPickupText] = useState(initialPickup);
  const [dropText, setDropText] = useState(initialDrop);
  const [pickupData, setPickupData] = useState<LocationData | null>(null);
  const [dropData, setDropData] = useState<LocationData | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');

  // Update customer info if profile changes
  useEffect(() => {
    if (userProfile) {
      setCustomerName(userProfile.name);
      setCustomerPhone(userProfile.phone);
    }
  }, [userProfile]);

  // Handle initialization of preset locations for automatic KM calculation
  useEffect(() => {
    if (initialPickup && PRESET_LOCATIONS[initialPickup]) {
      const loc = PRESET_LOCATIONS[initialPickup];
      setPickupData(loc);
      setPickupText(loc.name);
    }
    if (initialDrop && PRESET_LOCATIONS[initialDrop]) {
      const loc = PRESET_LOCATIONS[initialDrop];
      setDropData(loc);
      setDropText(loc.name);
    }
  }, [initialPickup, initialDrop]);

  useEffect(() => {
    const calculateDistance = async () => {
      if (pickupData && dropData) {
        setIsCalculatingDistance(true);
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pickupData.lon},${pickupData.lat};${dropData.lon},${dropData.lat}?overview=false`
          );
          const data = await response.json();
          if (data.routes && data.routes[0]) {
            setDistanceKm(Math.round(data.routes[0].distance / 1000));
          }
        } catch (error) {
          console.error('Distance fetch error:', error);
          setDistanceKm(35); 
        } finally {
          setIsCalculatingDistance(false);
        }
      }
    };
    calculateDistance();
  }, [pickupData, dropData]);

  const handleNext = () => {
    if (step === 1 && pickupData && dropData) setStep(2);
    else if (step === 2 && selectedVehicle) setStep(3);
  };

  const calculateFare = (v: Vehicle) => {
    if (!distanceKm) return v.baseFare;
    const isOutstation = distanceKm > 80;
    if (isOutstation && v.minKmOutstation) {
      const billableKm = Math.max(distanceKm, v.minKmOutstation);
      return Math.round(billableKm * v.pricePerKm);
    }
    return Math.round(v.baseFare + (Math.max(0, distanceKm - 80) * v.pricePerKm));
  };

  const isReviewComplete = customerName.trim() !== '' && customerPhone.trim().length >= 10;

  return (
    <div className="animate-in slide-in-from-right duration-500 py-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
              step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 mx-2 transition-all ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="px-1">
            <h2 className="text-2xl font-black text-slate-900">Plan Route</h2>
            <p className="text-xs text-slate-400 font-medium">Automatic road distance calculation</p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 pt-6">
                <div className="w-3 h-3 rounded-full border-[3px] border-blue-600 bg-white" />
                <div className="w-0.5 h-16 border-l-2 border-dashed border-slate-100" />
                <Navigation size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 space-y-6">
                <LocationInput 
                  label="Pickup Location"
                  value={pickupText}
                  onChange={setPickupText}
                  onSelect={setPickupData}
                  placeholder="Where from in Mumbai?"
                  icon={<MapPin size={16} />}
                />
                <LocationInput 
                  label="Destination"
                  value={dropText}
                  onChange={setDropText}
                  onSelect={setDropData}
                  placeholder="Where to?"
                  icon={<Navigation size={16} />}
                />
              </div>
            </div>
          </div>

          {isCalculatingDistance && (
            <div className="flex items-center justify-center gap-2 py-2 text-blue-600 text-xs font-bold animate-pulse">
              <Activity size={14} /> Fetching Road Distance...
            </div>
          )}

          {distanceKm !== null && !isCalculatingDistance && (
            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl flex items-center justify-between border border-emerald-100 shadow-sm animate-in zoom-in duration-200">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest">Est. Distance</span>
              </div>
              <span className="text-lg font-black">{distanceKm} KM</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-600 group transition-all">
              <span className="text-xs font-black uppercase tracking-tight text-blue-700">One Way</span>
              <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </button>
            <button className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group opacity-50 grayscale">
              <span className="text-xs font-black uppercase tracking-tight text-slate-400">Round Trip</span>
              <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
            </button>
          </div>

          <button 
            disabled={!pickupData || !dropData || isCalculatingDistance}
            onClick={handleNext}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-blue-100"
          >
            SELECT VEHICLE <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-2 px-1">
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Vehicle</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Rates calculated for {distanceKm} KM</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 underline uppercase tracking-widest">Rate Card</button>
          </div>
          
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 no-scrollbar">
            {VEHICLES.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              const fare = calculateFare(v);
              return (
                <div 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`relative p-5 rounded-[32px] border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-lg' 
                      : 'border-slate-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <img src={v.image} alt={v.name} className="w-20 h-20 object-cover rounded-2xl shadow-md border border-white" />
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-slate-800">{v.name}</h4>
                        <span className="text-lg font-black text-slate-900">₹{fare}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-white border border-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-slate-600">
                          <Users size={10} /> {v.seats} Seats
                        </span>
                        <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Available</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {v.features.map((f, i) => (
                          <span key={i} className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">/ {f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            disabled={!selectedVehicle}
            onClick={handleNext}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 disabled:opacity-30 transition-all shadow-xl shadow-blue-100 mt-4"
          >
            CONTINUE TO CONFIRM <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 shadow-inner">
              <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">Review Booking</h2>
            <p className="text-xs text-slate-400 font-medium mt-2">Personalized Mumbai commute</p>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passenger Info (Mandatory)</p>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <User size={18} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-transparent outline-none text-sm font-semibold w-full"
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Phone size={18} className="text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-transparent outline-none text-sm font-semibold w-full"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                <span>Route Detail ({distanceKm} KM)</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{pickupText}</p>
                <div className="w-0.5 h-4 bg-slate-100 ml-1" />
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{dropText}</p>
              </div>
            </div>

            <div className="h-px bg-slate-50" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Type</p>
                <p className="text-sm font-bold text-slate-800">{selectedVehicle?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Estimate</p>
                <p className="text-2xl font-black text-blue-600 leading-none mt-1">₹{selectedVehicle ? calculateFare(selectedVehicle) : 0}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
              <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-800 leading-relaxed font-bold">
                * Road tolls, Parking & Driver Bhatta (₹300/day for outstation) are additional. Confirm on WhatsApp for instant booking.
              </p>
            </div>
          </div>

          <button 
            disabled={!isReviewComplete}
            onClick={() => onConfirm({ 
              name: customerName,
              phone: customerPhone,
              pickup: pickupText, 
              drop: dropText, 
              vehicle: selectedVehicle, 
              fare: selectedVehicle ? calculateFare(selectedVehicle) : 0, 
              distance: distanceKm 
            })}
            className="w-full py-6 bg-emerald-500 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <MessageSquare size={24} /> Confirm on WhatsApp
          </button>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            24/7 Mumbai Safety Guarantee
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
