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
      queryClient.invalidateQueries({ queryKey: ['company-categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const response = await api.put(`/service-categories/my-company/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/service-categories/my-company/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-categories'] });
      // Invalida os serviços pois a exclusão da categoria altera o categoryId deles para null no backend
      queryClient.invalidateQueries({ queryKey: ['company-services'] });
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

  return { createCategory, updateCategory, deleteCategory, reorderCategories };
};