import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { td } from '../../../src/constants/responsive';

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visão Geral da Agenda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: td(20),
  },
  title: {
    fontSize: td(24),
    fontWeight: 'bold',
  },
});