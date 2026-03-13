// src/components/home/HomeHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';
import { Colors } from '@/colors/color';

interface HomeHeaderProps {
  userName: string;
  dateText: string;
  hasNotifications?: boolean;
  onNotificationPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  userName, 
  dateText, 
  hasNotifications = false, 
  onNotificationPress 
}) => { 
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Olá, {userName}</Text>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
      <Pressable style={styles.notificationBtn} onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" size={td(24)} color="#333" />
        {hasNotifications && <View style={styles.badge} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(32),
  },
  greeting: {
    fontSize: td(24),
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: td(14),
    color: '#64748B',
    marginTop: a(4),
  },
  notificationBtn: {
    width: td(44),
    height: td(44),
    borderRadius: td(22),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badge: {
    position: 'absolute',
    top: a(10),
    right: l(12),
    width: td(8),
    height: td(8),
    borderRadius: td(4),
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});