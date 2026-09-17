// components/shared/FormSelectTile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface FormSelectTileProps {
  label: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
  error?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export function FormSelectTile({ label, value, placeholder, onPress, error, iconName }: FormSelectTileProps) {
  const hasValue = !!value;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.tile, error && styles.tileError]}
      >
        <View style={styles.contentLeft}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={td(18)}
              color={hasValue ? Colors.corButton : Colors.placeholder}
              style={styles.icon}
            />
          )}
          <Text
            style={[styles.valueText, !hasValue && styles.placeholderText]}
            numberOfLines={1}
          >
            {hasValue ? value : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={td(18)} color={Colors.placeholder} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: td(13),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corText,
    marginBottom: a(6),
    paddingLeft:l(5)
  },
  labelError: {
    color: '#EF4444',
  },
  tile: {
    height: a(46),
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    borderRadius: td(10),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(14),
  },
  tileError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  contentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: l(8),
  },
  icon: {
    marginRight: l(8),
  },
  valueText: {
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium || 'System',
    color: Colors.corText,
  },
  placeholderText: {
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.placeholder,
  },
});