import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { l, td, a } from '@constants/responsive';
import { Colors } from '@colors/color';

type BackSimpleProps = {
  onBack: () => void;
  colorIcon?: string;
};

export const BackSimple = ({ colorIcon, onBack }: BackSimpleProps) => (
  <View style={styles.containerSimple}> 
    <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name='arrow-back' size={td(20)} color={colorIcon || Colors.black} />
    </TouchableOpacity>
  </View> 
);

const styles = StyleSheet.create({
  containerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    width: '100%',
    height: a(40),
    paddingHorizontal: l(10),
    gap: td(10),
  }
});