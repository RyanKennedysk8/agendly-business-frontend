import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export const useEmployeeMutations = () => {
  const queryClient = useQueryClient();

  const createEmployee = useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string; photoUrl?: string | null }) => {
      const response = await api.post('/employees/my-company', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; phone: string; email: string; photoUrl?: string | null } }) => {
      const response = await api.put(`/employees/my-company/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/my-company/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-employees'] });
      // Invalida serviços também, pois o profissional foi removido das listas de habilitados
      queryClient.invalidateQueries({ queryKey: ['company-services'] });
    },
  });

  return { createEmployee, updateEmployee, deleteEmployee };
};