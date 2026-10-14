import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface ClientSummaryDTO {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hasAppAccount: boolean;
  memberSince: string;
}

export const useCompanyClients = () => {
  return useQuery({
    queryKey: ['company-clients'],
    queryFn: async () => {
      const { data } = await api.get<ClientSummaryDTO[]>('/clients/my-company');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  });
};