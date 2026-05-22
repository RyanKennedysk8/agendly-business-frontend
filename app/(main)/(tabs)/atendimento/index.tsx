import { td } from '@/constants/responsive';
import { Image } from 'expo-image';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FinanceiroScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("@assets/images/logo3d.png")}
              style={{height:td(200), width:td(200)}}
              contentFit='contain'
              cachePolicy={"memory-disk"}
              transition={0}
      />
      <Text>Atendimento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 