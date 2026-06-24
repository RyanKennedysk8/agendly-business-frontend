// src/types/company.ts

export interface ServiceDTO {
    name: string;
    price: number;
    durationInMinutes: number;
    categoryName: string;
    employeeNames: string[];
  }

  export interface OperatingHourDTO {
    daysOfWeek: string[];
    openingTime: string;  
    closingTime: string;  
    breakStartTime?: string; 
    breakEndTime?: string;   
}
export type CompanyStatus = 'OPEN' | 'CLOSED' | 'BREAK';

export interface CompanyDetailResponse { 
  id: string;   
  name: string;
  categoryName: string;  
  displayName:string;
  logoUrl: string | null;
  images: string[]; 
  allowsEmployeeChoice: boolean;
  isRecommended: boolean;
  address: CompanyAddressDTO | null;
  services: ServiceDTO[];
  employees: EmployeeDTO[]; 
  operatingHours: OperatingHourDTO[];
  distance:number; 
  isOpen: boolean; 
  status:CompanyStatus;
  averageRating: number;
  totalReviews: number;
  starsDistribution: number[];
  nextTransitionMessage: string;
  nextTransitionTime: string | null;
  isFavorite: boolean;
}
  
  export interface EmployeeDTO {
    name: string;
    photoUrl: string;
    color?:string;
    daysOff: string[];
    specificOperatingHours: OperatingHourDTO[];
  }
  
  export interface CompanyAddressDTO {
    fullAddress: string;
    latitude: number;
    longitude: number;
  }
  
  export interface CompanyMockDTO {
    name: string;
    categoryName: string;
    logoUrl: string;
    allowsEmployeeChoice: boolean;
    isRecommended: boolean;
    serviceCategories: string[];
    images: string[];
    address: CompanyAddressDTO;
    operatingHours: OperatingHourDTO[];
    employees: EmployeeDTO[];
    services: ServiceDTO[];
  }