import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type SchedulingHeaderProps = {
  title: string;
  onBack: () => void;
};

export const SchedulingHeader = ({ title, onBack }: SchedulingHeaderProps) => (
  <View style={styles.containerScheduling}>
    <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name='arrow-back' size={td(24)} color={Colors.black} />
    </TouchableOpacity>
    <Text style={styles.txtTitle}>{title}</Text>
  </View>
); 

const styles = StyleSheet.create({
  containerScheduling: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: a(40),
    paddingHorizontal: l(15),
    gap: td(10),
    borderBottomWidth: 0.5, 
    borderColor: Colors.border
  },
  txtTitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText
  }
});