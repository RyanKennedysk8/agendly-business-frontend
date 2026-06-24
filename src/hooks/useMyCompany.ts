import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { CompanyDetailResponse } from '@/types/company';

// Interface que espelha o CompanyDetailResponse do backend


// Função pura de Fetch
const fetchMyCompany = async (): Promise<CompanyDetailResponse> => {
  const { data } = await api.get<CompanyDetailResponse>('/companies/me');
  return data;
};

// Factory de Opções (Excelente para Prefetching no Roteador)
export const myCompanyQueryOptions = () => ({
  queryKey: ['my-company'],
  queryFn: fetchMyCompany,
  // Dados da loja mudam pouco, podemos deixar um staleTime alto (ex: 15 minutos)
  staleTime: 1000 * 60 * 15, 
});

// Hook final para ser consumido pelas Views
export const useMyCompany = () => {
  return useQuery(myCompanyQueryOptions());
};