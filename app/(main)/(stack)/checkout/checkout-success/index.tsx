import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { ZoomIn, FadeInDown } from 'react-native-reanimated';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const { saleId, appointmentId } = useLocalSearchParams<{ saleId?: string; appointmentId?: string }>();

  const handleGoBack = () => {
    router.replace('/(main)/(tabs)/atendimento');
  };

  const handleViewReceipt = () => {
    router.replace({
      pathname: '/(main)/(stack)/receipt' as any,
      params: {
        ...(saleId ? { saleId } : {}),
        ...(appointmentId ? { appointmentId } : {}),
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CENTRO DA TELA: ÍCONE DE VERIFICADO + TEXTO EM BRANCO */}
      <View style={styles.centerContent}>
        <Animated.View entering={ZoomIn.duration(450)} style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle" size={td(96)} color={Colors.white} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(150).duration(400)} style={styles.title}>
          Checkout Completo
        </Animated.Text>

        <Animated.Text entering={FadeInDown.delay(250).duration(400)} style={styles.subtitle}>
          O pagamento foi registrado no caixa com sucesso.
        </Animated.Text>
      </View>

      {/* RODAPÉ: BOTÕES DE AÇÃO */}
      <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.footer}>
        <TouchableOpacity style={styles.btnReceipt} activeOpacity={0.85} onPress={handleViewReceipt}>
          <Ionicons name="receipt-outline" size={td(20)} color="#16A34A" />
          <Text style={styles.btnReceiptText}>Ver Comprovante</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnBack} activeOpacity={0.85} onPress={handleGoBack}>
          <Text style={styles.btnBackText}>Voltar para Atendimentos</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16A34A', // Fundo 100% verde de confirmação
    justifyContent: 'space-between',
    paddingHorizontal: l(24),
    paddingTop: a(60),
    paddingBottom: a(40),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: a(16),
  },
  title: {
    fontSize: td(26),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: a(8),
  },
  footer: {
    gap: a(12),
  },
  btnReceipt: {
    backgroundColor: Colors.white,
    height: a(54),
    borderRadius: td(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: l(8),
  },
  btnReceiptText: {
    fontSize: td(15),
    fontFamily: fonts.robotoBold,
    color: '#16A34A',
  },
  btnBack: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    height: a(54),
    borderRadius: td(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBackText: {
    fontSize: td(15),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
  },
});