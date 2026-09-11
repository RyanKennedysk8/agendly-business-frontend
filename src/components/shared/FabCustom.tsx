import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type FabCustomProps = {
  label?: string;
  onPress?: () => void;
};

export const FabCustom = ({
  label,
  onPress,
}: FabCustomProps) => {
  const isExtended = !!label;

  return (
    <Pressable
      style={[
        styles.fab,
        isExtended && styles.extendedFab,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name="add"
        size={td(24)}
        color="#FFFFFF"
      />

      {isExtended && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: a(24),
    right: l(20),
    paddingHorizontal:l(10),
    paddingVertical:a(10),
    borderRadius: td(28),

    backgroundColor: Colors.corButton,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 4,
  },

  extendedFab: {
    width: 'auto',
    paddingHorizontal: l(18),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: l(2),
  },

  label: {
    color: '#FFF',
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
  },
});