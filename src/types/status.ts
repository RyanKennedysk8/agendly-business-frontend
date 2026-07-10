export enum AppointmentStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
    CONFIRMED = 'CONFIRMED',
    AWAITING_COMPLETION = 'AWAITING_COMPLETION',
    CANCELLED_BY_CLIENT = 'CANCELLED_BY_CLIENT',
    CANCELLED_BY_COMPANY = 'CANCELLED_BY_COMPANY',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
  }
  
  // Mapeamento visual estrito para a interface do gestor
  export const StatusTheme: Record<AppointmentStatus, { bg: string; text: string; border: string }> = {
    [AppointmentStatus.PENDING_CONFIRMATION]: { bg: '#FEF08A', text: '#854D0E', border: '#FDE047' }, // Amarelo (Atenção necessária)
    [AppointmentStatus.CONFIRMED]: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },           // Azul (Confirmado, aguardando horário)
    [AppointmentStatus.AWAITING_COMPLETION]: { bg: '#F3E8FF', text: '#7E22CE', border: '#D8B4FE' },  // Roxo (Em andamento na cadeira)
    [AppointmentStatus.COMPLETED]: { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },            // Verde (Finalizado/Pago)
    [AppointmentStatus.CANCELLED_BY_CLIENT]: { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' },  // Cinza (Cancelado pelo cliente)
    [AppointmentStatus.CANCELLED_BY_COMPANY]: { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' }, // Vermelho claro (Cancelado pela loja)
    [AppointmentStatus.NO_SHOW]: { bg: '#FECACA', text: '#991B1B', border: '#FCA5A5' },              // Vermelho escuro (Falta)
  };