import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

export interface AttendanceMainHeaderProps {
  title?: string;
  rightLabel?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export const AttendanceMainHeader: React.FC<AttendanceMainHeaderProps> = ({
  title = 'Caixa & Operação',
  rightLabel = 'Balanço',
  rightIcon = 'bar-chart-outline',
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {onRightPress && (
        <TouchableOpacity 
          style={styles.actionBtn} 
          activeOpacity={0.75} 
          onPress={onRightPress}
        >
          <Ionicons name={rightIcon} size={td(16)} color="#1b1b1b" />
          <Text style={styles.actionBtnText}>{rightLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: a(56),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: td(20),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(6),
    backgroundColor: '#F1F5F9',
    paddingHorizontal: l(12),
    paddingVertical: a(6),
    borderRadius: td(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnText: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: '#1b1b1b',
  },
});