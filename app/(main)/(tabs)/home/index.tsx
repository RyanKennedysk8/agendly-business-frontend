// app/(main)/index.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '@components/features/home/HomeHeader';
import { QuickActionsPanel, QuickActionItem } from '@components/features/home/QuickActionsPanel';
import { FinancialDashboard } from '@/components/features/home/FinancialDashboard';
import { DailyQueue, QueueItemType } from '@/components/features/home/DailyQueue';
import { l, a } from '@/constants/responsive';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/colors/color';

// --- Dados Mockados (Futuramente virão do React Query/Backend) ---
const mockFinancial = { revenue: 1450.00, expenses: 320.50 };
const mockQueue: QueueItemType[] = [
  { id: '1', clientName: 'Carlos Silva', service: 'Corte Degradê', time: '14:00', status: 'waiting' },
  { id: '2', clientName: 'João Pedro', service: 'Barba Terapia', time: '14:45', status: 'waiting' },
];
const QUICK_ACTIONS: QuickActionItem[] = [
  { id: 'new_apt', title: 'Agendar', icon: 'calendar-outline', color: '#2E7D32', route: '/novo-agendamento' },
  { id: 'new_client', title: 'Cliente', icon: 'person-add-outline', color: '#1976D2', route: '/novo-cliente' },
  { id: 'expense', title: 'Despesa', icon: 'trending-down-outline', color: '#D32F2F', route: '/nova-despesa' },
  { id: 'services', title: 'Serviços', icon: 'cut-outline', color: '#E65100', route: '/servicos' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Handlers de navegação e ação
  const handleActionPress = (route: string) => console.log(`Navigando para: ${route}`);
  const handleViewQueue = () => router.push('/(main)/(tabs)/agendamentos');
  const handleViewFinance = () => router.push('/(main)/(tabs)/checkIn'); 

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'}/>
      <Stack.Screen 
        options={{
          headerType:"null",
        }as any}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: Platform.OS === 'web' ? a(24) : insets.top + a(16) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400).springify()}>
          <HomeHeader 
            userName="Gestor" 
            dateText="Terça-feira, 11 de Março" 
            hasNotifications={true}
            onNotificationPress={() => console.log('Notificações abertas')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
          <QuickActionsPanel actions={QUICK_ACTIONS} onActionPress={handleActionPress} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400).springify()}>
          <FinancialDashboard 
            revenue={mockFinancial.revenue} 
            expenses={mockFinancial.expenses} 
            onViewDetails={handleViewFinance} 
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400).springify()}>
          <DailyQueue 
            queue={mockQueue} 
            onViewAll={handleViewQueue} 
            onItemAction={(id) => console.log(`Ação no item ${id}`)} 
          />
        </Animated.View>

        <View style={{ height: a(80) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.corContainer
  },
  scrollContent: { 
    paddingHorizontal: l(20) 
  },
});