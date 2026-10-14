import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface ClientPayload {
  name: string;
  phone: string;
  email?: string;
}

export const useClientMutations = () => {
  const queryClient = useQueryClient();

  const createClient = useMutation({
    mutationFn: async (data: ClientPayload) => {
      const response = await api.post('/clients/my-company', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-clients'] });
    },
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientPayload }) => {
      const response = await api.put(`/clients/my-company/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-clients'] });
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clients/my-company/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-clients'] });
    },
  });

  return { createClient, updateClient, deleteClient };
};