import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { AppointmentDetail, AppointmentDetailDTO, AppointmentStatus } from '@/types/appointments'; // Ajuste o path conforme sua estrutura
import { useMemo } from 'react';


// O Adapter converte o JSON do Java para o formato exato que o Frontend (AppointmentDetail) exige
const adapterBackendToFrontend = (dto: AppointmentDetailDTO): AppointmentDetail => {
    return {
        appointmentId: dto.appointmentId,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: dto.status,
        canReview: dto.canReview,
        priceAtBooking: dto.priceAtBooking,
        createdAt: dto.createdAt,
        notes: dto.notes,
        
        serviceId: dto.serviceId,
        serviceName: dto.serviceName,
        serviceDuration: dto.serviceDuration,
        
        companyId: dto.companyId,
        companyName: dto.companyName,
        companyLogoUrl: dto.companyLogoUrl,
        companyAddress: dto.companyAddress,
        companyLatitude: dto.companyLatitude,
        companyLongitude: dto.companyLongitude,
        
        employeeId: dto.employeeId,
        employeeName: dto.employeeName || 'Sem Profissional',
        employeePhotoUrl: dto.employeePhotoUrl,
        employeeColor: dto.employeeColorHex || '#CBD5E1' 
    };
};

const fetchAgenda = async (start: Date, end: Date): Promise<AppointmentDetail[]> => {
    const startStr = start.toISOString().split('T')[0] + 'T00:00:00';
    const endStr = end.toISOString().split('T')[0] + 'T23:59:59';

    const { data } = await api.get<AppointmentDetailDTO[]>(
        `/appointments/company-calendar?start=${startStr}&end=${endStr}`
    );
    
    return data.map(adapterBackendToFrontend);
};

export const useAgendaAppointments = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Determinação dos limites de chunking de dados na memória do cluster
    const startOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
    const endOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);

    return useQuery({
        // A invalidação de cache rastreia estritamente a janela mensal visualizada
        queryKey: ['agenda', year, month],
        queryFn: () => fetchAgenda(startOfMonth, endOfMonth),
        staleTime: 1000 * 60 * 5, // Memória em cache por 5 minutos
    });
};