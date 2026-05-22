// app/(main)/index.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuickActionsPanel } from '@components/features/home/QuickActionsPanel';
import { FinancialDashboard } from '@/components/features/home/FinancialDashboard';
import { DailyQueue } from '@/components/features/home/DailyQueue';
import { l, a } from '@/constants/responsive';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/colors/color';
import { mockQueue } from '@/mocks/appointments';
import { QUICK_ACTIONS } from '@/mocks/home';
import { COMPANY_MOCK } from '@/mocks/company';
import { EmployeeStatusDTO, TeamOverview } from '@/components/features/home/TeamOverview';
import { QuickScheduleCard } from '@/components/features/home/QuickScheduleCard';

const mockFinancial = { revenue: 1450.00, expenses: 320.50 };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();


  // Handlers de navegação e ação
  const handleActionPress = (route: string) => router.push(route as any);
  const handleViewQueue = () => router.push('/(main)/(tabs)/agendamento');
  const handleViewFinance = () => router.push('/(main)/(tabs)/atendimento');
  const handleManualSchedule = () => { router.push('/(main)/(tabs)/agendamento');;};

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'}/>
      <Stack.Screen 
        options={{
          headerType:"home",
          homeHeaderParams:{
            userName:"Ryan Kennedy"
          }
        }as any}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={
          styles.scrollContent 
        }
        showsVerticalScrollIndicator={false}
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
          <DailyQueue 
            queue={mockQueue} 
            onViewAll={handleViewQueue} 
            onItemAction={(id) => console.log(`Ação no item ${id}`)} 
          />
        </Animated.View>

    
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white,
    paddingTop:a(5)
  },
  scrollContent: { 
    paddingHorizontal:l(10), 
    paddingBottom: a(10),
    paddingTop:a(10),
    alignSelf: 'center', 
    width: '100%',
  },
});