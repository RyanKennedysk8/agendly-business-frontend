import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type HomeHeaderProps = {
  userName: string;
  dateTime: string;
};

export const HomeHeader = ({ userName,  dateTime, }: HomeHeaderProps) => (
  <View style={styles.container}> 
    <Text style={styles.txtGreeting}>Olá, {userName}</Text>
    <Text style={styles.txtDate}>{dateTime}</Text>
    <Image style={styles.logo} source={require("@assets/images/agendlyTxtBlack.png")}/>
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
  logo: {
    height: a(60),
    width: l(70)
  },
  handle: {
    flexDirection: 'row',
    alignItems: "center",
    gap: td(5)
  },
  txtEndereco: {
    fontFamily: fonts.robotoRegular,
    fontSize: td(12),
    color: Colors.corText
  },
  txtGreeting:{
    fontSize: td(24),
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  txtDate:{
    fontSize: td(14),
    color: '#64748B',
    marginTop: a(4),
  }
});