

export interface User {
  id: string; 
  name: string; 
  email: string; 
  cpf: string;
  phone: string | null;
  birthDate: string | null; 
  memberSince: string;    
  profileImageUrl: string | null; 
  notificationSettings: NotificationSettings; 
} 
  
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface NotificationSettings {
  pushAppointments: boolean;
  pushPromotions: boolean;
  pushRecommendations: boolean;
  pushAppUpdates: boolean;
  emailPromotions: boolean;
  emailNewsletters: boolean;
}

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  OTHER = 'OTHER'
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  weight?: number;
  birthDate?: string; // YYYY-MM-DD
}

export interface PetCreateData {
  name: string;
  type: PetType;
  breed?: string;
  weight?: number;
  birthDate?: string;
}

export interface UserAddress {
  id: string;
  label: string;
  fullAddress: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
}

export interface UserAddressCreateData {
  label?: string;
  fullAddress: string;
  street?: string;
  number: string; // Obrigatório
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
}