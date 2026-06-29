import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface ServiceCategoryDTO {
  id: string;
  name: string;
}

export const useCompanyCategories = () => {
  return useQuery({
    queryKey: ['company-categories'],
    queryFn: async () => {
      const { data } = await api.get<ServiceCategoryDTO[]>('/service-categories/my-company');
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
};