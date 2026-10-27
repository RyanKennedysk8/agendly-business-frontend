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
    maxHeight: a(35),
  },
  content: {
    paddingHorizontal: l(5),
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: l(15),
    paddingVertical: a(5),
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  pillActive: {
    borderBottomColor: Colors.corButton,
  },
  text: {
    fontSize: td(13),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
  },
  textActive: {
    color: Colors.corButton,
    fontFamily: fonts.robotoMedium,
  },
});