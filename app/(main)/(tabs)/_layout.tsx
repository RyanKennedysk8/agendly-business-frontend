import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useResponsiveLayout } from '../../../src/hooks/useResponsiveLayout';
// import { Sidebar } from '../../src/components/navigation/Sidebar'; // A ser criado

export default function MainLayout() {
  const { isDesktop } = useResponsiveLayout();

  if (isDesktop) {
    // Layout Web/Desktop: Navegação Lateral (Sidebar)
    return (
      <View style={styles.webContainer}>
        {/* Componente Sidebar Customizado (Descomentar após criar) */}
        {/* <Sidebar /> */}
        
        {/* Gambiarra Técnica do Expo Router: 
            Usamos o componente Tabs nativo para gerenciar o estado das rotas filhas, 
            mas forçamos a barra de navegação inferior a sumir (display: none).
            A navegação real será feita pelos <Link> dentro do componente Sidebar. */}
        <View style={styles.webContent}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' }, 
            }}
          >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="financeiro" />
          </Tabs>
        </View>
      </View>
    );
  }

  // Layout Mobile: Navegação Inferior (Bottom Tabs) padrão do seu app cliente
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32', // Cor primária do Business (exemplo)
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financeiro"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F7FA', // Background base do SaaS
  },
  webContent: {
    flex: 1,
    overflow: 'hidden', // Previne scroll horizontal não intencional na Web
  },
});