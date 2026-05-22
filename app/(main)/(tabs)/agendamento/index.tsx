import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { DesktopAgenda } from '@/components/features/agendamentos/DesktopAgenda';
import { MobileAgenda } from '@components/features/agendamentos/MobileAgenda';
import { AppointmentResponseDTO, EmployeeSummaryDTO } from '@type/appointments';
import { MOCK_APPOINTMENTS, MOCK_STAFF } from '@/mocks/appointments';
import { Stack } from 'expo-router';


export default function AgendamentoScreen() {
  const { isDesktop } = useResponsiveLayout();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
  const [staffList, setStaffList] = useState<EmployeeSummaryDTO[]>([]);

  useEffect(() => {
    const fetchAgenda = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAppointments(MOCK_APPOINTMENTS);
      setStaffList(MOCK_STAFF);
      setIsLoading(false);
    };
    fetchAgenda();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {isDesktop ? (
        <DesktopAgenda appointments={appointments} staffList={staffList} />
      ) : (
        <View style={{flex:1}}>
          <Stack.Screen 
            options={{
              headerType:"custom",
              
            }as any}
          />
          <MobileAgenda appointments={appointments} staffList={staffList} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC' 
  },
});