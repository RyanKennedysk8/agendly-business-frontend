import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../../src/hooks/useResponsiveLayout';
import { td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';

const TAB_SCREENS = [
  { name: 'home', title: 'Início', icon: 'home' },
  { name: 'checkIn', title: 'Check-in', icon: 'bag-check' },
  { name: 'agendamentos', title: 'Agendamentos', icon: 'calendar' }, 
  { name: 'cliente', title: 'Cliente', icon: 'people' },
  { name: 'profile', title: 'Perfil', icon: 'storefront' },
];

export default function MainLayout() {
  const { isDesktop } = useResponsiveLayout();
  const insets = useSafeAreaInsets();

  const renderTabs = (isHidden: boolean) => (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.corText,
        tabBarInactiveTintColor: Colors.corTextSecondary,
        tabBarStyle: isHidden 
          ? { display: 'none' } 
          : [
              styles.tabBarContainer,
              {
                height: td(50) + insets.bottom,
                paddingBottom: insets.bottom || td(10), 
              },
            ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {TAB_SCREENS.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? (screen.icon as any) : `${screen.icon}-outline`}
                size={td(20)}
                color={focused ? Colors.corText : Colors.corTextSecondary}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );

  if (isDesktop) {
    return (
      <View style={styles.webContainer}>
        <Sidebar />
        <View style={styles.webContent}>
          {renderTabs(true)}
        </View>
      </View>
    );
  }

  return renderTabs(false);
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  webContent: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  tabBarItem: {
    alignItems: 'center',
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: td(10),
  },
});