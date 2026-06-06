import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';

// 1. Importação dos seus componentes de UI (Onde a mágica acontece)
import { CalendarPager } from '@/components/calendar/CalendarPager';

// 3. Hooks de layout (para saber se é Mobile ou Desktop)
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { AppointmentDetail } from '@/types/appointments';
import { mockAppointments } from '@/mocks/mockAppointments';
import { MOCK_STAFF } from '@/mocks/appointments';

export default function AgendamentoScreen() {
    const { isDesktop } = useResponsiveLayout();
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado que vai segurar os dados (hoje do mock, amanhã da API)
    const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);

    useEffect(() => {
        // Simulando uma chamada de API com 800ms de delay
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Simula o "await api.get()"
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setAppointments(mockAppointments);
                setStaffList(MOCK_STAFF);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF7A00" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <StatusBar barStyle={'light-content'}/>
          <CalendarPager 
            appointments={appointments} 
            staffList={staffList} 
          />
        </View>
    );
}