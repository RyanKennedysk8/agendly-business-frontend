import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useMarkNoShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.patch(`/appointments/${appointmentId}/no-show`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['daily-queue'] });
    },
  });
};