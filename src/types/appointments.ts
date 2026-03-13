export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export interface UserSummaryDTO {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
}

export interface ServiceSummaryDTO {
  id: string;
  name: string;
  durationMinutes: number;
}

export interface EmployeeSummaryDTO {
  id: string;
  name: string;
  role: string;
  colorHex: string;
  avatarUrl: string | null;
}

export interface AppointmentResponseDTO {
  id: string;
  client: UserSummaryDTO;
  employee: EmployeeSummaryDTO;
  service: ServiceSummaryDTO;
  status: AppointmentStatus;
  scheduledDate: string; // Formato ISO YYYY-MM-DD
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
  priceAtBooking: number;
  notes: string | null;
}