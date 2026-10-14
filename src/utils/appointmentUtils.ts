import { AppointmentStatus, StatusTheme } from '@/colors/color';
import { AppointmentDetail } from '@/types/appointments';

// Pseudo-status exclusivo do Frontend para separar o que está rolando agora do que já acabou
export type UIAppointmentStatus = AppointmentStatus | 'IN_PROGRESS';

export const getDisplayStatus = (item: AppointmentDetail | any): UIAppointmentStatus => {
  const now = new Date();
  const startTime = new Date(item.startTime);
  const endTime = new Date(item.endTime);

  // Se a loja não marcou como concluído ou cancelado, a linha do tempo assume o controle
  if (item.status === AppointmentStatus.CONFIRMED || item.status === AppointmentStatus.AWAITING_COMPLETION) {
    if (now >= startTime && now <= endTime) {
      return 'IN_PROGRESS'; // Cliente na cadeira (Em atendimento)
    } else if (now > endTime) {
      return AppointmentStatus.AWAITING_COMPLETION; // Horário passou, precisa de ação (Pendente)
    }
  }

  return item.status as UIAppointmentStatus;
};

export const getStatusLabel = (status: UIAppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED: return 'Aguardando';
    case 'IN_PROGRESS': return 'Em atendimento';
    case AppointmentStatus.AWAITING_COMPLETION: return 'Pendente (Aguardando Ação)';
    case AppointmentStatus.COMPLETED: return 'Finalizado';
    case AppointmentStatus.PENDING_CONFIRMATION: return 'Pendente Confirmação';
    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_COMPANY: return 'Cancelado';
    case AppointmentStatus.NO_SHOW: return 'Não compareceu';
    default: return 'Desconhecido';
  }
};

export const getStatusIcon = (status: UIAppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED: return 'time-outline';
    case 'IN_PROGRESS': return 'play-circle-outline';
    case AppointmentStatus.AWAITING_COMPLETION: return 'alert-circle-outline'; // Ícone de alerta leve
    case AppointmentStatus.COMPLETED: return 'checkmark-circle';
    case AppointmentStatus.PENDING_CONFIRMATION: return 'help-circle-outline';
    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_COMPANY: return 'close-circle';
    case AppointmentStatus.NO_SHOW: return 'warning-outline';
    default: return 'ellipse-outline';
  }
};

export const getThemeForAppointment = (item: AppointmentDetail | any) => {
  const displayStatus = getDisplayStatus(item);
  
  // Mescla o pseudo-status com o seu StatusTheme existente
  const theme = displayStatus === 'IN_PROGRESS' 
    ? { bg: '#E0E7FF', text: '#4338CA', border: '#C7D2FE' } // Azul Indigo dinâmico
    : StatusTheme[displayStatus as AppointmentStatus] || StatusTheme[AppointmentStatus.CONFIRMED];

  return { status: displayStatus, theme };
};