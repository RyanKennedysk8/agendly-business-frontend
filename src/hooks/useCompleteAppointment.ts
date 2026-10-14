import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface CompletePayload {
  id: string;
  data: {
    finalPrice: number;
    actualEndTime: string;
    checkoutNotes: string;
  };
}

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: CompletePayload) => {
      await api.patch(`/appointments/${id}/complete`, data);
    },
    onSuccess: () => {
      // Invalida o cache para forçar a tela de atendimentos a buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['daily-queue'] });
    },
  });
};