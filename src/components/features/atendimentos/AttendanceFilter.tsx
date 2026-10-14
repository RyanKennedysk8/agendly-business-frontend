import React from 'react';
import { ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';

export type FilterType = 'ALL' | 'IN_PROGRESS' | 'AWAITING_COMPLETION' | 'COMPLETED' | 'CANCELLED';

interface FilterOption {
  value: FilterType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'AWAITING_COMPLETION', label: 'Pendentes' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Finalizados' },
  { value: 'CANCELLED', label: 'Cancelados / Faltas' },
];

interface Props {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
}

export const AttendanceFilter: React.FC<Props> = ({ activeFilter, onChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: a(50),
    minHeight: a(50),
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: l(16),
    alignItems: 'center',
    gap: l(8),
  },
  pill: {
    paddingHorizontal: l(16),
    paddingVertical: a(8),
    borderRadius: td(20),
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.corButtonDisable, // Fundo sutil combinando com a nova cor da marca
    borderColor: Colors.corButton,
  },
  text: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextInfo,
  },
  textActive: {
    color: Colors.corButton,
    fontFamily: fonts.robotoBold,
  },
});