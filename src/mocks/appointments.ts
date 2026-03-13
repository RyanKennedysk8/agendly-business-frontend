import { AppointmentResponseDTO, EmployeeSummaryDTO } from '@/types/appointments';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrowStr = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

export const MOCK_STAFF: EmployeeSummaryDTO[] = [
  { id: 'emp_1', name: 'Roberto', role: 'Barbeiro Sênior', colorHex: '#3B82F6', avatarUrl: 'https://i.pravatar.cc/150?u=roberto' },
  { id: 'emp_2', name: 'Lucas', role: 'Barbeiro', colorHex: '#10B981', avatarUrl: 'https://i.pravatar.cc/150?u=lucas' },
  { id: 'emp_3', name: 'Amanda', role: 'Colorista', colorHex: '#F59E0B', avatarUrl: null }, // Teste de fallback
];

export const MOCK_APPOINTMENTS: AppointmentResponseDTO[] = [
  {
    id: 'apt_101',
    client: { id: 'cli_1', name: 'Carlos Silva', phone: '11999999999', avatarUrl: null },
    employee: MOCK_STAFF[0], // Roberto
    service: { id: 'srv_1', name: 'Corte Degradê', durationMinutes: 60 },
    status: 'CONFIRMED',
    scheduledDate: todayStr,
    startTime: '09:00',
    endTime: '10:00',
    priceAtBooking: 45.00,
    notes: 'Cliente prefere máquina 0 do lado.',
  },
  {
    id: 'apt_102',
    client: { id: 'cli_2', name: 'João Marcos', phone: '11988888888', avatarUrl: null },
    employee: MOCK_STAFF[1], // Lucas
    service: { id: 'srv_2', name: 'Barba Terapia', durationMinutes: 60 },
    status: 'COMPLETED',
    scheduledDate: todayStr,
    startTime: '09:30',
    endTime: '10:30',
    priceAtBooking: 35.00,
    notes: null,
  },
  {
    id: 'apt_103',
    client: { id: 'cli_3', name: 'Pedro Paulo', phone: '11977777777', avatarUrl: null },
    employee: MOCK_STAFF[2], // Amanda
    service: { id: 'srv_3', name: 'Platinado Global', durationMinutes: 90 },
    status: 'IN_PROGRESS',
    scheduledDate: todayStr,
    startTime: '11:00',
    endTime: '12:30',
    priceAtBooking: 120.00,
    notes: null,
  },
  {
    id: 'apt_104',
    client: { id: 'cli_4', name: 'Marcos Oliveira', phone: '11966666666', avatarUrl: null },
    employee: MOCK_STAFF[0], // Roberto
    service: { id: 'srv_4', name: 'Corte Social', durationMinutes: 45 },
    status: 'PENDING',
    scheduledDate: todayStr,
    startTime: '14:00',
    endTime: '14:45',
    priceAtBooking: 40.00,
    notes: 'Atrasado 5 min.',
  },
  {
    id: 'apt_105',
    client: { id: 'cli_5', name: 'Felipe', phone: '11955555555', avatarUrl: null },
    employee: MOCK_STAFF[1], // Lucas
    service: { id: 'srv_1', name: 'Corte Degradê', durationMinutes: 60 },
    status: 'CONFIRMED',
    scheduledDate: tomorrowStr,
    startTime: '10:00',
    endTime: '11:00',
    priceAtBooking: 45.00,
    notes: null,
  }
];