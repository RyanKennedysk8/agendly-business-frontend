import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// Interface idêntica ao seu DTO do Java
export interface ServiceResponseDTO {
  id: string;
  name: string;
  price: number;
  durationInMinutes: number;
  isHomeService: boolean;
  isPetService: boolean;
  categoryName: string;
}

// A páginação do Spring devolve os dados dentro do array "content"
interface SpringPageResponse {
  content: ServiceResponseDTO[];
  totalElements: number;
  totalPages: number;
}

const fetchCompanyServices = async (): Promise<ServiceResponseDTO[]> => {
  const { data } = await api.get<SpringPageResponse>('/services/my-company');
  return data.content;
};

export const useCompanyServices = () => {
  return useQuery({
    queryKey: ['company-services'],
    queryFn: fetchCompanyServices,
    staleTime: 1000 * 60 * 5, 
  });
};