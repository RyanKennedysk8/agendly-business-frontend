import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

export const ProfileHeader = () => (
  <View style={styles.containerProfile}>
    <Text style={styles.txtProfile}>Meu Perfil</Text>
  </View>
);

const styles = StyleSheet.create({
  containerProfile: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center', 
    height: a(40),
    marginHorizontal: l(5),
    marginTop: a(5),
    borderRadius: td(8)
  },
  txtProfile: {
    fontFamily: fonts.robotoMedium,
    fontSize: td(14),
    color: Colors.corText,
  }
});