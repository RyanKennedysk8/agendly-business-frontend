import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface EmployeeSummaryDTO {
  id: string;
  name: string;
  photoUrl?: string;
}

export const useCompanyEmployees = () => {
  return useQuery({
    queryKey: ['company-employees'],
    queryFn: async () => {
      const { data } = await api.get<EmployeeSummaryDTO[]>('/employees/my-company');
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
};