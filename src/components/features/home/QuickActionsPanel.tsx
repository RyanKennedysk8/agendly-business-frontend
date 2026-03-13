// src/components/home/QuickActionsPanel.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

interface QuickActionsPanelProps {
  actions: QuickActionItem[];
  onActionPress: (route: string) => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ actions, onActionPress }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      <View style={styles.quickActionsContainer}>
        {actions.map((action) => (
          <Pressable 
            key={action.id}
            style={styles.actionBtn}
            onPress={() => onActionPress(action.route)}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: `${action.color}15` }]}>
              <Ionicons name={action.icon} size={td(28)} color={action.color} />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: a(32) }, 
  sectionTitle: {
    fontSize: td(18),
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: a(16),
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', 
  },
  actionBtn: { alignItems: 'center', width: l(70) },
  actionIconWrapper: {
    width: td(56),
    height: td(56),
    borderRadius: td(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: a(8),
  },
  actionText: {
    fontSize: td(12),
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
});