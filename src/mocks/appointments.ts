import { QueueItemType } from '@/components/features/home/QueueItem';
import { AppointmentResponseDTO, AppointmentStatus, EmployeeSummaryDTO } from '@/types/appointments';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrowStr = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

export const MOCK_STAFF: EmployeeSummaryDTO[] = [
  { 
    id: 'emp_1', 
    name: 'Roberto', 
    role: 'Barbeiro Sênior', 
    colorHex: '#3B82F6', 
    avatarUrl: 'https://i.pravatar.cc/150?u=roberto' 
  },
  { 
    id: 'emp_2', 
    name: 'Lucas', 
    role: 'Barbeiro', 
    colorHex: '#10B981', 
    avatarUrl: 'https://i.pravatar.cc/150?u=lucas' 
  },
  { 
    id: 'emp_3', 
    name: 'Amanda', 
    role: 'Colorista', 
    colorHex: '#F59E0B', 
    avatarUrl: null 
  },
];

export const MOCK_APPOINTMENTS: AppointmentResponseDTO[] = [
  {
    id: 'apt_101',
    client: { id: 'cli_1', name: 'Carlos Silva', phone: '11999999999', avatarUrl: null },
    employee: MOCK_STAFF[0], // Roberto
    service: { id: 'srv_1', name: 'Corte Degradê', durationMinutes: 60 },
    status: AppointmentStatus.CONFIRMED,
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
    status: AppointmentStatus.AWAITING_COMPLETION,
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
    status: AppointmentStatus.PENDING_CONFIRMATION,
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
    status: AppointmentStatus.PENDING_CONFIRMATION,
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
    status: AppointmentStatus.CONFIRMED,
    scheduledDate: tomorrowStr,
    startTime: '10:00',
    endTime: '11:00',
    priceAtBooking: 45.00,
    notes: null,
  }
];

export const mockQueue: QueueItemType[] = [
  {
    id: '1',
    clientName: 'Carlos Silva',
    service: 'Corte Degradê',
    time: '14:00',
    status: 'completed',
    client: { id: 'c1', name: 'Carlos Silva', phone: '31999999901' },
    serviceData: { id: 's1', name: 'Corte Degradê', duration: 30, price: 35 },
    professional: { id: 'p1', name: 'João Barbeiro' },
    dateTime: '2026-04-22T14:00:00',
  },
  {
    id: '2',
    clientName: 'João Pedro',
    service: 'Barba Terapia',
    time: '14:20',
    status: 'completed',
    client: { id: 'c2', name: 'João Pedro', phone: '31999999902' },
    serviceData: { id: 's2', name: 'Barba Terapia', duration: 25, price: 30 },
    professional: { id: 'p1', name: 'João Barbeiro' },
    dateTime: '2026-04-22T14:20:00',
  },
  {
    id: '3',
    clientName: 'Lucas Fernandes',
    service: 'Corte Social',
    time: '14:40',
    status: 'in_progress',
    client: { id: 'c3', name: 'Lucas Fernandes', phone: '31999999903' },
    serviceData: { id: 's3', name: 'Corte Social', duration: 30, price: 30 },
    professional: { id: 'p2', name: 'Pedro' },
    dateTime: '2026-04-22T14:40:00',
  },
  {
    id: '4',
    clientName: 'Mateus Henrique',
    service: 'Corte + Barba',
    time: '15:00',
    status: 'in_progress',
    client: { id: 'c4', name: 'Mateus Henrique', phone: '31999999904' },
    serviceData: { id: 's4', name: 'Corte + Barba', duration: 50, price: 60 },
    professional: { id: 'p2', name: 'Pedro' },
    dateTime: '2026-04-22T15:00:00',
  },
  {
    id: '5',
    clientName: 'Gabriel Souza',
    service: 'Corte Navalhado',
    time: '15:20',
    status: 'waiting',
    client: { id: 'c5', name: 'Gabriel Souza', phone: '31999999905' },
    serviceData: { id: 's5', name: 'Corte Navalhado', duration: 35, price: 40 },
    professional: { id: 'p3', name: 'Ricardo' },
    dateTime: '2026-04-22T15:20:00',
  },
  {
    id: '6',
    clientName: 'Rafael Costa',
    service: 'Barba Completa',
    time: '15:40',
    status: 'waiting',
    client: { id: 'c6', name: 'Rafael Costa', phone: '31999999906' },
    serviceData: { id: 's6', name: 'Barba Completa', duration: 30, price: 35 },
    professional: { id: 'p3', name: 'Ricardo' },
    dateTime: '2026-04-22T15:40:00',
  },
  {
    id: '7',
    clientName: 'Bruno Martins',
    service: 'Corte Infantil',
    time: '16:00',
    status: 'waiting',
    client: { id: 'c7', name: 'Bruno Martins', phone: '31999999907' },
    serviceData: { id: 's7', name: 'Corte Infantil', duration: 25, price: 25 },
    professional: { id: 'p1', name: 'João Barbeiro' },
    dateTime: '2026-04-22T16:00:00',
  },
  {
    id: '8',
    clientName: 'Felipe Rocha',
    service: 'Corte Degradê',
    time: '16:20',
    status: 'waiting',
    client: { id: 'c8', name: 'Felipe Rocha', phone: '31999999908' },
    serviceData: { id: 's1', name: 'Corte Degradê', duration: 30, price: 35 },
    professional: { id: 'p2', name: 'Pedro' },
    dateTime: '2026-04-22T16:20:00',
  },
  {
    id: '9',
    clientName: 'André Lima',
    service: 'Corte + Sobrancelha',
    time: '16:40',
    status: 'waiting',
    client: { id: 'c9', name: 'André Lima', phone: '31999999909' },
    serviceData: { id: 's8', name: 'Corte + Sobrancelha', duration: 40, price: 45 },
    professional: { id: 'p3', name: 'Ricardo' },
    dateTime: '2026-04-22T16:40:00',
  },
  {
    id: '10',
    clientName: 'Diego Alves',
    service: 'Barba Terapia',
    time: '17:00',
    status: 'waiting',
    client: { id: 'c10', name: 'Diego Alves', phone: '31999999910' },
    serviceData: { id: 's2', name: 'Barba Terapia', duration: 25, price: 30 },
    professional: { id: 'p1', name: 'João Barbeiro' },
    dateTime: '2026-04-22T17:00:00',
  },
];