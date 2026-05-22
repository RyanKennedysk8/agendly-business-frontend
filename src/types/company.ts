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
    breakStartTime: string | null;
    breakEndTime: string | null;
  }
  
  export interface EmployeeDTO {
    name: string;
    photoUrl: string;
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