import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type CategoryHeaderProps = {
  title: string;
  onBack: () => void;
}; 

export const CategoryHeader = ({ title, onBack }: CategoryHeaderProps) => (
  <View style={styles.containerCategory}>
    <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name='arrow-back' size={td(20)} color={Colors.black}/>
    </TouchableOpacity>
    <View>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={{ width: td(20) }}/>
  </View>
);

const styles = StyleSheet.create({
  containerCategory: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between', 
    height: a(40),
    paddingHorizontal: l(10),
    marginHorizontal: l(5),
    marginVertical: a(5),
    borderRadius: td(8)
  },
  title: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
    textAlign: 'center'
  }
});