import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, ActivityIndicator, Text, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuickActionsPanel } from '@/components/features/home/QuickActionsPanel';
import { FinancialDashboard } from '@/components/features/home/FinancialDashboard';
import { DailyQueue } from '@/components/features/home/DailyQueue';
import { l, a, td } from '@/constants/responsive';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/colors/color';
import { QUICK_ACTIONS } from '@/mocks/home';
import { QuickScheduleCard } from '@/components/features/home/QuickScheduleCard';
import { fonts } from '@/assets/fonts/fonts';

import { useDailyQueue } from '@/hooks/useDailyQueue';

const mockFinancial = { revenue: 1450.00, expenses: 320.50 };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Puxamos também o 'refetch' para forçar a atualização manual
  const { data: queueData = [], isLoading: isQueueLoading, refetch } = useDailyQueue();
  const [refreshing, setRefreshing] = useState(false);

  // Função disparada quando o usuário arrasta a tela para baixo
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleActionPress = (route: string) => router.push(route as any);
  const handleViewQueue = () => router.push('/(main)/(tabs)/agendamento');
  const handleViewFinance = () => router.push('/(main)/(tabs)/atendimento');
  const handleManualSchedule = () => router.push('/(main)/(tabs)/agendamento');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'}/>
      <Stack.Screen 
        options={{
          headerType:"home",
          homeHeaderParams:{
            userName:"Ryan Kennedy"
          }
        } as any}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        // Ativa o pull-to-refresh nativo
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[Colors.corButton]} // Cor do loader no Android
            tintColor={Colors.corButton} // Cor do loader no iOS
          />
        }
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
          <QuickActionsPanel actions={QUICK_ACTIONS} onActionPress={handleActionPress}/>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400).springify()}>
          <QuickScheduleCard onPress={handleManualSchedule} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400).springify()}>
          <FinancialDashboard 
            revenue={mockFinancial.revenue} 
            expenses={mockFinancial.expenses} 
            onViewDetails={handleViewFinance}  
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(400).springify()}>
          {isQueueLoading && !refreshing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={Colors.corButton} />
              <Text style={styles.loadingText}>Carregando fila do dia...</Text>
            </View>
          ) : (
            <DailyQueue 
              queue={queueData}  
              onViewAll={handleViewQueue} 
              onItemAction={(id) => console.log(`Ação no item ${id}`)} 
            />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white,
    paddingTop: a(5)
  },
  scrollContent: { 
    paddingHorizontal: l(10), 
    paddingBottom: a(10),
    paddingTop: a(10),
    alignSelf: 'center', 
    width: '100%',
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    paddingVertical: a(40),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: a(32),
  },
  loadingText: {
    marginTop: a(10),
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextLight,
  }
});