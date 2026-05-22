import { CompanyMockDTO } from '@/types/company';

export const COMPANY_MOCK: CompanyMockDTO = {
  name: "Salão Duarte",
  categoryName: "Estetica",
  logoUrl: "https://img.freepik.com/vetores-premium/silhueta-dourada-de-uma-menina-com-tesoura-e-pente_261524-3828.jpg?w=740",
  allowsEmployeeChoice: true,
  isRecommended: true,
  serviceCategories: [
    "Cabelo", "Face", "Barba", "Combos", "Promoções", "Química", "Unhas"
  ],
  images: [
    "https://cdn.pixabay.com/photo/2018/03/31/04/48/beauty-salon-3277314_640.jpg",
    "https://img.freepik.com/fotos-gratis/cabeleireiro-cuidando-de-seu-cliente_23-2149319799.jpg?w=740"
  ],
  address: {
    fullAddress: "R. Henrique Leite, 45 - Novo progresso, Contagem - MG, 32185-300",
    latitude: -19.86315,
    longitude: -44.06256
  },
  operatingHours: [
    {
      daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      openingTime: "08:00:00",
      closingTime: "20:00:00",
      breakStartTime: "12:00:00",
      breakEndTime: "13:00:00"
    },
    {
      daysOfWeek: ["SATURDAY", "SUNDAY"],
      openingTime: "08:00:00",
      closingTime: "14:00:00",
      breakStartTime: null,
      breakEndTime: null
    }
  ],
  employees: [
    {
      name: "Silvano Kennedy",
      photoUrl: "https://i.pinimg.com/736x/d4/7d/f2/d47df2a0629bc144d2033bd7eea59c6a.jpg",
      daysOff: ["2025-06-25", "2025-06-26"],
      specificOperatingHours: [
        {
          daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          openingTime: "08:00:00",
          closingTime: "20:00:00",
          breakStartTime: "12:00:00",
          breakEndTime: "13:00:00"
        },
        {
          daysOfWeek: ["SATURDAY"],
          openingTime: "08:00:00",
          closingTime: "09:00:00",
          breakStartTime: null,
          breakEndTime: null
        },
        {
          daysOfWeek: ["SUNDAY"],
          openingTime: "09:00:00",
          closingTime: "12:00:00",
          breakStartTime: null,
          breakEndTime: null
        }
      ]
    },
    {
      name: "Cleusa Duarte",
      photoUrl: "https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/88321514_2879707595418930_9027381177215877120_n.jpg",
      daysOff: [],
      specificOperatingHours: []
    },
    {
      name: "Ryan Kennedy",
      photoUrl: "https://i.pinimg.com/736x/54/f2/0a/54f20a3afdfce3cc6e6ae66e286e6d7c.jpg",
      daysOff: [],
      specificOperatingHours: [
        {
          daysOfWeek: ["MONDAY", "TUESDAY", "THURSDAY", "FRIDAY"],
          openingTime: "08:00:00",
          closingTime: "16:00:00",
          breakStartTime: "12:00:00",
          breakEndTime: "13:00:00"
        }
      ]
    }
  ],
  services: [
    { name: "Corte", price: 40.99, durationInMinutes: 30, categoryName: "Cabelo", employeeNames: ["Silvano Kennedy", "Cleusa Duarte", "Ryan Kennedy"] },
    { name: "Sobrancelha", price: 20.00, durationInMinutes: 12, categoryName: "Face", employeeNames: ["Silvano Kennedy", "Cleusa Duarte"] },
    { name: "Barba", price: 25.99, durationInMinutes: 20, categoryName: "Barba", employeeNames: ["Silvano Kennedy", "Cleusa Duarte", "Ryan Kennedy"] },
    { name: "Corte + Barba", price: 59.99, durationInMinutes: 50, categoryName: "Combos", employeeNames: ["Silvano Kennedy", "Cleusa Duarte", "Ryan Kennedy"] },
    { name: "Hidratação", price: 35.50, durationInMinutes: 25, categoryName: "Promoções", employeeNames: ["Cleusa Duarte"] },
    { name: "Coloração", price: 89.90, durationInMinutes: 60, categoryName: "Química", employeeNames: ["Silvano Kennedy", "Cleusa Duarte", "Ryan Kennedy"] },
    { name: "Manicure", price: 30.00, durationInMinutes: 40, categoryName: "Unhas", employeeNames: ["Cleusa Duarte"] },
    { name: "Pedicure", price: 35.00, durationInMinutes: 45, categoryName: "Unhas", employeeNames: ["Cleusa Duarte"] }
  ]
};