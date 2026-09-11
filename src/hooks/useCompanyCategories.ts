import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ServiceCategoryResponseDTO } from '@/types/company';


export const useCompanyCategories = () => {
  return useQuery({
    queryKey: ['company-categories'],
    queryFn: async () => {
      const { data } = await api.get<ServiceCategoryResponseDTO[]>('/service-categories/my-company');
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
};