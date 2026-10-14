import React, { useState, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  | { type: 'item'; id: string; data: AppointmentDetail };

export default function AtendimentoScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  
  const { data: company } = useMyCompany();
  const { data: appointments = [], isLoading, refetch } = useAttendanceHistory();
  const { mutateAsync: markNoShow } = useMarkNoShow();

  const groupedAndSortedData = useMemo(() => {
    const filtered = appointments.filter(appt => {
      const displayStatus = getDisplayStatus(appt);
      
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'AWAITING_COMPLETION') return displayStatus === 'AWAITING_COMPLETION';
      if (activeFilter === 'IN_PROGRESS') return displayStatus === 'IN_PROGRESS';
      if (activeFilter === 'COMPLETED') return displayStatus === 'COMPLETED';
      if (activeFilter === 'CANCELLED') return ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY', 'NO_SHOW'].includes(displayStatus);
      
      return true;
    });

    filtered.sort((aObj, bObj) => {
      return new Date(bObj.startTime).getTime() - new Date(aObj.startTime).getTime();
    });

    const sections: ListItem[] = [];
    let currentDateStr = '';

    filtered.forEach(appt => {
      const dateStr = new Date(appt.startTime).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (dateStr !== currentDateStr) {
        sections.push({ type: 'header', id: `header-${dateStr}`, dateLabel: dateStr });
        currentDateStr = dateStr;
      }
      
      sections.push({ type: 'item', id: appt.appointmentId, data: appt });
    });

    return sections;
  }, [appointments, activeFilter]);

  // OPÇÃO 1: Checkout de Agendamento
  const handleComplete = (item: AppointmentDetail) => {
    const { clearCart, setContext, addItem } = useCartStore.getState();
  
    const companyId = item.companyId || company?.id;
  
    if (!companyId) {
      console.error('ID da empresa não encontrado.');
      return;
    }
  
    clearCart();
  
    setContext(companyId, item.clientId, item.employeeId);
  
    addItem({
      type: 'APPOINTMENT',
      referenceId: item.appointmentId,
      description: item.serviceName,
      quantity: 1,
      unitPrice: item.priceAtBooking ?? 0,
    });
  
    router.push('/(main)/(tabs)/atendimento/checkout');
  };

  // OPÇÃO 2: Venda Avulsa (PDV Direto sem agendamento)
  const handleQuickSale = () => {
    const companyId = company?.id || appointments[0]?.companyId;
    if (!companyId) {
      Alert.alert('Atenção', 'Não foi possível identificar a empresa ativa.');
      return;
    }

    const { clearCart, setContext } = useCartStore.getState();
    clearCart();
    setContext(companyId, undefined, undefined);
    router.push('/(main)/(tabs)/atendimento/checkout');
  };

  // OPÇÃO 1 (Cont.): Marcar Não Comparecimento
  const handleNoShow = (id: string) => {
    Alert.alert(
      'Confirmar Falta',
      'Deseja marcar que o cliente não compareceu a este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar Falta', 
          style: 'destructive',
          onPress: async () => {
            try {
              await markNoShow(id);
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível registrar a ausência.');
            }
          }
        }
      ]
    );
  };

  // OPÇÃO 3: Visualizar Recibo
  const handleViewReceipt = (appointmentId: string) => {
    router.push({
      pathname: '/(main)/(tabs)/atendimento/receipt' as any,
      params: { appointmentId }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: true, title: 'Caixa & Atendimentos', headerShadowVisible: false }} />

      <AttendanceFilter activeFilter={activeFilter} onChange={setActiveFilter} />

      <View style={styles.listContainer}>
        <FlashList
          data={groupedAndSortedData}
          keyExtractor={(item) => item.id}
          getItemType={(item) => item.type}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={styles.dateHeaderContainer}>
                  <Text style={styles.dateHeaderText}>{item.dateLabel}</Text>
                </View>
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
              message="Nenhum atendimento" 
              subMessage="Não há registros correspondentes a este filtro no momento."
            />
          }
        />

        {/* FAB: Botão Flutuante de Venda Avulsa (PDV) */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleQuickSale}>
          <Ionicons name="cart-outline" size={td(22)} color={Colors.white} />
          <Text style={styles.fabText}>Nova Venda</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  listContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  listContent: { paddingVertical: a(16), paddingHorizontal: l(16), paddingBottom: a(110) },
  dateHeaderContainer: { marginTop: a(8), marginBottom: a(12), paddingHorizontal: l(4) },
  dateHeaderText: { fontSize: td(14), fontFamily: fonts.robotoBold, color: Colors.corTextSecondary },
  fab: {
    position: 'absolute',
    bottom: a(24),
    right: l(16),
    backgroundColor: '#1b1b1b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(14),
    paddingHorizontal: l(20),
    borderRadius: td(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    gap: l(8),
  },
  fabText: {
    color: Colors.white,
    fontFamily: fonts.robotoBold,
    fontSize: td(14),
  },
});