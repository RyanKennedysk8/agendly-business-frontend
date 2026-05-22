// src/mocks/servicesMock.ts
export interface ServiceDTO {
    id: string;
    name: string;
    price: number;
    durationInMinutes: number;
    categoryName: string;
  }
  
  export const MOCK_SERVICES: ServiceDTO[] = [
    { id: '1', name: "Corte Degradê", price: 45.00, durationInMinutes: 40, categoryName: "Cabelo" },
    { id: '2', name: "Sobrancelha na Navalha", price: 15.00, durationInMinutes: 15, categoryName: "Face" },
    { id: '3', name: "Barba Terapia (Toalha Quente)", price: 35.00, durationInMinutes: 30, categoryName: "Barba" },
    { id: '4', name: "Corte + Barba VIP", price: 75.00, durationInMinutes: 60, categoryName: "Combos" },
    { id: '5', name: "Platinado / Luzes", price: 120.00, durationInMinutes: 120, categoryName: "Química" },
    { id: '6', name: "Limpeza de Pele Profunda", price: 89.90, durationInMinutes: 50, categoryName: "Estética" },
  ];