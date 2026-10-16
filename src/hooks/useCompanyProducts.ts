import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface CompanyProduct {
  id: string;
  companyId: string;
  name: string;
  price: number;
}

export const useCompanyProducts = (companyId?: string | null) => {
  return useQuery({
    queryKey: ['company-products', companyId],
    queryFn: async () => {
      const { data } = await api.get<CompanyProduct[]>(`/products/company/${companyId}`);
      return data;
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<CompanyProduct, 'id'>) => {
      const { data } = await api.post<CompanyProduct>('/products', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-products', variables.companyId] });
    },
  });
};