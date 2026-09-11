import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await api.post('/service-categories/my-company', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalida a query que busca as categorias da loja, atualizando o Modal instantaneamente
      queryClient.invalidateQueries({ queryKey: ['company-categories'] });
    },
  });

  const reorderCategories = useMutation({
    mutationFn: async (items: { id: string; position: number }[]) => {
      await api.put('/service-categories/my-company/reorder', { items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-categories'] });
    },
  });

  return { createCategory, reorderCategories};
};