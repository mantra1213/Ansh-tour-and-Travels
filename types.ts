
export enum VehicleType {
  HATCHBACK = 'Hatchback',
  SEDAN = 'Sedan',
  SUV = 'SUV',
  BIG_SUV = 'Innova/Premium SUV',
  LUXURY = 'Luxury Chauffeur',
  BUS = 'Tempo Traveller',
  MINI_BUS = 'AC Mini Bus'
}

export interface LocationData {
  name: string;
  lat: string;
  lon: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  name: string;
  pricePerKm: number;
  baseFare: number;
  seats: number;
  image: string;
  features: string[];
  minKmOutstation?: number;
}

export interface Booking {
  id: string;
  pickup: LocationData;
  destination: LocationData;
  date: string;
  time: string;
  vehicleType: VehicleType;
  status: 'upcoming' | 'completed' | 'cancelled';
  totalFare: number;
  distanceKm: number;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  category: 'Spiritual' | 'Nature' | 'Corporate' | 'Wedding';
}

export type Language = 'en' | 'hi' | 'mr';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
