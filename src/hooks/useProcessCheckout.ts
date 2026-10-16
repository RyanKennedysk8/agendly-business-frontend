import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useProcessCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<{ saleId: string }>('/sales/checkout', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
      queryClient.invalidateQueries({ queryKey: ['daily-queue'] });
      queryClient.invalidateQueries({ queryKey: ['standalone-sales'] });
    },
  });
};