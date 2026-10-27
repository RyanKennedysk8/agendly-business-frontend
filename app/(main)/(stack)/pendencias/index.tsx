import React, { useState, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Text, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useAttendanceHistory } from '@/hooks/useAttendanceHistory';
import { useMarkNoShow } from '@/hooks/useMarkNoShow';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCartStore } from '@/store/useCartStore';
import { EmptyList } from '@/components/shared/EmptyList';
import { AttendanceFilter, FilterType } from '@/components/features/atendimentos/AttendanceFilter';
import { AttendanceCard } from '@/components/features/atendimentos/AttendanceCard';
import { getDisplayStatus } from '@/utils/appointmentUtils';
import { AppointmentDetail } from '@/types/appointments';

type ListItem = 
  | { type: 'header'; id: string; dateLabel: string }
  | { type: 'appointment'; id: string; data: AppointmentDetail };

export default function PendenciasScreen() {
  const router = useRouter();
  // Inicia focado direto nos atendimentos que aguardam checkout
  const [activeFilter, setActiveFilter] = useState<FilterType>('AWAITING_COMPLETION');

  const { data: company } = useMyCompany();
  const { data: appointments = [], isLoading, refetch } = useAttendanceHistory();
  const { mutateAsync: markNoShow } = useMarkNoShow();

  const activeCompanyId = company?.id || appointments[0]?.companyId;

  const groupedData = useMemo(() => {
    const filtered = appointments.filter(appt => {
      const status = getDisplayStatus(appt);
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'AWAITING_COMPLETION') return status === 'AWAITING_COMPLETION';
      if (activeFilter === 'IN_PROGRESS') return status === 'IN_PROGRESS';
      if (activeFilter === 'COMPLETED') return status === 'COMPLETED';
      if (activeFilter === 'CANCELLED') return ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY', 'NO_SHOW'].includes(status);
      return true;
    });

    filtered.sort((aObj, bObj) => new Date(bObj.startTime).getTime() - new Date(aObj.startTime).getTime());

    const sections: ListItem[] = [];
    let currentDateStr = '';

    filtered.forEach(appt => {
      const dateStr = new Date(appt.startTime).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });

      if (dateStr !== currentDateStr) {
        sections.push({ type: 'header', id: `header-${dateStr}`, dateLabel: dateStr });
        currentDateStr = dateStr;
      }
      sections.push({ type: 'appointment', id: appt.appointmentId, data: appt });
    });

    return sections;
  }, [appointments, activeFilter]);

  const handleComplete = (item: AppointmentDetail) => {
    const { clearCart, setContext, addItem } = useCartStore.getState();
    clearCart();
    setContext(item.companyId || activeCompanyId, item.clientId, item.employeeId);
    addItem({
      type: 'APPOINTMENT',
      referenceId: item.appointmentId,
      description: item.serviceName,
      quantity: 1,
      unitPrice: item.priceAtBooking ?? 0,
    });
    router.push('/(main)/(stack)/checkout'as any); 
  };

  const handleNoShow = (id: string) => {
    Alert.alert( 
      'Confirmar Falta',
      'Deseja registrar que o cliente não compareceu?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar Falta', 
          style: 'destructive',
          onPress: async () => {
            await markNoShow(id);
          }
        }
      ]
    );
  };

  const handleViewReceipt = (appointmentId: string) => {
    router.push({ pathname: '/(main)/(stack)/receipt'as any, params: { appointmentId } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Atendimentos',
          headerType: 'attendanceSub',
          attendanceParams: {
            subtitle: 'Checkouts pendentes e histórico',
          }
        } as any} 
      />

      <AttendanceFilter activeFilter={activeFilter} onChange={setActiveFilter} />

      <View style={styles.listContainer}>
        <FlashList
          data={groupedData}
          keyExtractor={(item) => item.id}
          getItemType={(item) => item.type}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
              <View></View>
              );
            }
            return (
              <AttendanceCard
                item={item.data}
                onComplete={() => handleComplete(item.data)}
                onNoShow={() => handleNoShow(item.data.appointmentId)}
                onViewReceipt={() => handleViewReceipt(item.data.appointmentId)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyList
              message="Tudo em dia!"
              subMessage="Não há atendimentos pendentes para este filtro."
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  listContainer: { 
    flex: 1, 
    backgroundColor: Colors.white
  },
  listContent: { 
    paddingVertical: a(10), 
    paddingHorizontal: l(10), 
    paddingBottom: a(60) 
  },
  dateHeaderContainer: { 
    paddingHorizontal: l(10),
    paddingVertical: a(4),
    borderRadius: td(6),
  },
  dateHeaderText: { 
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },
});