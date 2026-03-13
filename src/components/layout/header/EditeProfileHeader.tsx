import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type EditeProfileHeaderProps = {
  title: string;
  onBack: () => void;
  rightComponent?: React.ReactNode; 
};

export const EditeProfileHeader = ({ title, onBack, rightComponent }: EditeProfileHeaderProps) => ( 
  <View style={styles.containerProfileCustom}>
    <TouchableOpacity style={{ width: td(50) }} onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name='arrow-back' size={td(20)} color={Colors.black}/>
    </TouchableOpacity>
    <Text style={styles.txtTitle}>
      {title}
    </Text>
    {rightComponent || <View style={{ width: td(50) }}/>}
  </View> 
);

const styles = StyleSheet.create({
  containerProfileCustom: {
    height: a(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: l(15),
    borderBottomWidth: 0.5, 
    borderColor: Colors.border
  },
  txtTitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText
  }
});