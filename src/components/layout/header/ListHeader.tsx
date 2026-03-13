import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

export const ListHeader = () => (
  <View style={styles.container}> 
    <Text style={styles.title}>Próximos Agendamentos</Text>
  </View> 
); 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    height: a(40),
    paddingHorizontal: l(10),
    paddingBottom: a(5)
  },
  title: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
    textAlign: 'center'
  }
});