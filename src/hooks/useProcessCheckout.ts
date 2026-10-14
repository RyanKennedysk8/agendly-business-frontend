import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useProcessCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      await api.post('/sales/checkout', payload);
    },
    onSuccess: () => {
      // Força a lista de atendimentos e a fila do dia a recarregarem
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['daily-queue'] });
    },
  });
};