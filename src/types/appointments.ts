
export interface UserSummaryDTO {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
};

export interface ServiceSummaryDTO {
  id: string;
  name: string;
  durationMinutes: number;
};

export interface EmployeeSummaryDTO {
  id: string;
  name: string;
  role: string;
  colorHex: string;
  avatarUrl: string | null;
};

export interface AppointmentResponseDTO {
  id: string;
  client: UserSummaryDTO;
  employee: EmployeeSummaryDTO;
  service: ServiceSummaryDTO;
  status: AppointmentStatus;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  priceAtBooking: number;
  notes: string | null;
};

export enum AppointmentStatus {
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  AWAITING_COMPLETION = 'AWAITING_COMPLETION',
  CANCELLED_BY_CLIENT = 'CANCELLED_BY_CLIENT',
  CANCELLED_BY_COMPANY = 'CANCELLED_BY_COMPANY',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
};

// Interface correspondente ao AppointmentDetailDTO do backend
export interface AppointmentDetail { 
appointmentId: string;
startTime: string; 
endTime: string; 
status: AppointmentStatus;
canReview: boolean;
priceAtBooking: number; 
createdAt:string;  
notes?:string;
// Detalhes do serviço
serviceId: string; 
serviceName: string;
serviceDuration: number;
 
// Detalhes da Empresa
companyId: string; 
companyName: string;
companyLogoUrl?: string; 
companyAddress?: string; 
companyLatitude?:number | null;
companyLongitude?:number | null;

// Detalhes do Funcionário 
employeeId?: string;
employeeName?: string;
employeePhotoUrl?: string; 
}