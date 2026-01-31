
import { VehicleType, Vehicle, TourPackage, LocationData } from './types';

export const COLORS = {
  primary: '#1e3a8a',
  secondary: '#10b981',
  accent: '#f59e0b',
  background: '#f8fafc',
  dark: '#0f172a',
};

export const PRESET_LOCATIONS: Record<string, LocationData> = {
  'Mumbai': { name: 'Mumbai (Gateway of India)', lat: '18.9220', lon: '72.8347' },
  'Pune': { name: 'Pune (Railway Station)', lat: '18.5284', lon: '73.8739' },
  'Shirdi': { name: 'Shirdi (Sai Baba Temple)', lat: '19.7645', lon: '74.4762' },
  'Airport': { name: 'Mumbai Airport (T2)', lat: '19.0896', lon: '72.8656' },
  'Badlapur': { name: 'Badlapur Station', lat: '19.1495', lon: '73.2343' },
  'Navi Mumbai': { name: 'Vashi, Navi Mumbai', lat: '19.0330', lon: '73.0297' },
  'Mumbai Sightseeing': { name: 'Marine Drive, Mumbai', lat: '18.9431', lon: '72.8230' }
};

export const VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    type: VehicleType.HATCHBACK,
    name: 'Maruti WagonR / Indica',
    pricePerKm: 11,
    baseFare: 1200,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    features: ['AC', 'Compact', 'Budget Friendly'],
    minKmOutstation: 300
  },
  {
    id: 'v2',
    type: VehicleType.SEDAN,
    name: 'Dzire / Xcent / City',
    pricePerKm: 14,
    baseFare: 2000,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
    features: ['AC', 'Comfortable', 'Best for Outstation'],
    minKmOutstation: 300
  },
  {
    id: 'v3',
    type: VehicleType.BIG_SUV,
    name: 'Innova / Crysta / Ertiga',
    pricePerKm: 20,
    baseFare: 4000,
    seats: 7,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
    features: ['Premium MUV', 'Family Choice', 'Spacious'],
    minKmOutstation: 300
  },
  {
    id: 'v4',
    type: VehicleType.BUS,
    name: 'Tempo Traveller',
    pricePerKm: 27,
    baseFare: 6500,
    seats: 12,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
    features: ['Group Travel', 'High Roof', 'Music System'],
    minKmOutstation: 300
  },
  {
    id: 'v5',
    type: VehicleType.LUXURY,
    name: 'Mercedes / BMW Chauffeur',
    pricePerKm: 80,
    baseFare: 10000,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400',
    features: ['Elite Service', 'Premium Leather', 'Business Class']
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'p1',
    title: 'Shirdi Spiritual Journey',
    description: 'One-way or round trip to Sai Baba Temple with expert drivers.',
    price: '₹2,999 onwards',
    duration: '1-2 Days',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=500',
    category: 'Spiritual'
  },
  {
    id: 'p2',
    title: 'Lonavala Monsoon Retreat',
    description: 'Scenic drive to Tiger Point, Bhushi Dam and Lonavala sights.',
    price: '₹2,499 onwards',
    duration: 'Full Day',
    image: 'https://images.unsplash.com/photo-1582531652750-719f964a781d?auto=format&fit=crop&q=80&w=500',
    category: 'Nature'
  },
  {
    id: 'p3',
    title: 'Mahabaleshwar Tour',
    description: 'Explore strawberry farms and Venna lake with family.',
    price: '₹5,500 onwards',
    duration: '3 Days',
    image: 'https://images.unsplash.com/photo-1623906841330-466d7168c049?auto=format&fit=crop&q=80&w=500',
    category: 'Nature'
  }
];
