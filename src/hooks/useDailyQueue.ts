import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { AppointmentDetail } from '@/types/appointments';

// Função para formatar a data sem o 'Z' do fuso horário
const formatLocalISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
};

export const useDailyQueue = () => {
  return useQuery({
    queryKey: ['daily-queue'],
    queryFn: async () => {
      const now = new Date();
      
      // Começo do dia: 00:00:00
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      // Fim do dia: 23:59:59
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const { data } = await api.get<AppointmentDetail[]>('/appointments/company-calendar', {
        params: {
          start: formatLocalISO(startOfDay), // Agora vai limpo: 2026-10-02T00:00:00
          end: formatLocalISO(endOfDay),
        },
      });
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
};