import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ServiceRequestDTO, ServiceResponseDTO } from '@/types/company';

// Espelho exato do ServiceRequestDTO do Java

export const useServiceMutations = () => {
    const queryClient = useQueryClient();

    const createService = useMutation({
        mutationFn: async (data: ServiceRequestDTO) => {
            const response = await api.post<ServiceResponseDTO>('/services/my-company', data);
            return response.data;
        },
        onSuccess: () => {
            // O segredo da reatividade: Invalida o cache da lista, forçando um refetch invisível
            queryClient.invalidateQueries({ queryKey: ['company-services'] });
        },
    });

    const updateService = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: ServiceRequestDTO }) => {
            const response = await api.put<ServiceResponseDTO>(`/services/my-company/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company-services'] });
        },
    });
    const deleteService = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/services/my-company/${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['company-services'] }),
    });

    return { createService, updateService, deleteService};
};