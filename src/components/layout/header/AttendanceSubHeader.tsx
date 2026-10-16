import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

export interface AttendanceSubHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightText?: string;
  rightColor?: string;
  onRightPress?: () => void;
}

export const AttendanceSubHeader: React.FC<AttendanceSubHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  rightText,
  rightColor = '#FF7A00',
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={onBack} 
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={td(22)} color={Colors.corTextTitle} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {onRightPress ? (
          <TouchableOpacity 
            style={styles.rightBtn} 
            onPress={onRightPress} 
            activeOpacity={0.7}
          >
            {rightIcon && <Ionicons name={rightIcon} size={td(18)} color={rightColor} />}
            {rightText && <Text style={[styles.rightText, { color: rightColor }]}>{rightText}</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
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
  backBtn: {
    width: td(36),
    height: td(36),
    borderRadius: td(18),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: l(8),
  },
  title: {
    fontSize: td(16),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
  },
  subtitle: {
    fontSize: td(11),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(1),
  },
  rightContainer: {
    minWidth: td(36),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(4),
    paddingVertical: a(4),
    paddingHorizontal: l(6),
  },
  rightText: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
  },
  rightPlaceholder: {
    width: td(36),
  },
});