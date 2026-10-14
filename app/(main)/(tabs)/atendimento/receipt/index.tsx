import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useSaleReceipt } from '@/hooks/useSaleReceipt';

const PAYMENT_LABELS: Record<string, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
};

export default function ReceiptScreen() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const { data: receipt, isLoading, isError } = useSaleReceipt(appointmentId);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Comprovante de Venda', headerShadowVisible: false }} />

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#FF7A00" />
        </View>
      ) : isError || !receipt ? (
        <View style={styles.centerBox}>
          <Ionicons name="document-text-outline" size={td(48)} color={Colors.corTextSecondary} />
          <Text style={styles.errorText}>Não foi possível localizar o recibo detalhado desta transação.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.receiptPaper}>
            <View style={styles.receiptHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={td(28)} color="#16A34A" />
              </View>
              <Text style={styles.receiptStatus}>Pagamento Concluído</Text>
              <Text style={styles.receiptDate}>
                {new Date(receipt.createdAt).toLocaleString('pt-BR')}
              </Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Cliente</Text>
                <Text style={styles.metaValue}>{receipt.clientName}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Profissional</Text>
                <Text style={styles.metaValue}>{receipt.employeeName}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Método</Text>
                <Text style={styles.metaValue}>{PAYMENT_LABELS[receipt.paymentMethod] || receipt.paymentMethod}</Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <Text style={styles.itemsTitle}>ITENS DISCRIMINADOS</Text>
            {receipt.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.quantity}x {item.description}</Text>
                  <Text style={styles.itemType}>
                    {item.type === 'APPOINTMENT' ? 'Serviço' : 'Adicional / Produto'}
                  </Text>
                </View>
                <Text style={styles.itemSubtotal}>R$ {item.subtotal.toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.dashedDivider} />

            <View style={styles.totalsSection}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Subtotal</Text>
                <Text style={styles.metaValue}>R$ {receipt.subtotal.toFixed(2)}</Text>
              </View>
              {receipt.discount > 0 && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Desconto</Text>
                  <Text style={[styles.metaValue, { color: Colors.error }]}>- R$ {receipt.discount.toFixed(2)}</Text>
                </View>
              )}
              {receipt.tip > 0 && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Gorjeta</Text>
                  <Text style={styles.metaValue}>+ R$ {receipt.tip.toFixed(2)}</Text>
                </View>
              )}
              <View style={[styles.metaRow, { marginTop: a(8) }]}>
                <Text style={styles.totalLabel}>TOTAL PAGO</Text>
                <Text style={styles.totalAmount}>R$ {receipt.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: l(24) },
  errorText: { marginTop: a(12), fontSize: td(14), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary, textAlign: 'center' },
  scrollContent: { padding: l(16), paddingBottom: a(40) },
  receiptPaper: {
    backgroundColor: Colors.white,
    borderRadius: td(16),
    padding: l(20),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptHeader: { alignItems: 'center', marginBottom: a(16) },
  iconCircle: { width: td(52), height: td(52), borderRadius: td(26), backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: a(10) },
  receiptStatus: { fontSize: td(16), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  receiptDate: { fontSize: td(12), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary, marginTop: a(4) },
  dashedDivider: { height: 1, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginVertical: a(16) },
  metaSection: { gap: a(8) },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: td(13), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  metaValue: { fontSize: td(13), fontFamily: fonts.robotoMedium, color: Colors.corText },
  itemsTitle: { fontSize: td(11), fontFamily: fonts.robotoBold, color: Colors.corTextSecondary, marginBottom: a(12), letterSpacing: 0.5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(12) },
  itemName: { fontSize: td(14), fontFamily: fonts.robotoMedium, color: Colors.corText },
  itemType: { fontSize: td(11), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  itemSubtotal: { fontSize: td(14), fontFamily: fonts.robotoBold, color: Colors.corText },
  totalsSection: { gap: a(8) },
  totalLabel: { fontSize: td(15), fontFamily: fonts.robotoBold, color: Colors.corTextTitle },
  totalAmount: { fontSize: td(18), fontFamily: fonts.robotoBold, color: '#16A34A' },
});