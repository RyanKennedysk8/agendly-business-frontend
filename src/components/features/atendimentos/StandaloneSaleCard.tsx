import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { SaleReceipt } from '@/hooks/useSaleReceipt';

interface Props {
  sale: SaleReceipt;
  onViewReceipt: () => void;
}

export const StandaloneSaleCard: React.FC<Props> = ({ sale, onViewReceipt }) => {
  const timeStr = new Date(sale.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const itemsSummary = sale.items.map(i => `${i.quantity}x ${i.description}`).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.timeGroup}>
          <Text style={styles.time}>{timeStr}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="cart-outline" size={td(12)} color="#FF7A00" style={{ marginRight: l(4) }} />
          <Text style={styles.badgeText}>Venda Direta / PDV</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title} numberOfLines={1}>{itemsSummary}</Text>
          <Text style={styles.amount}>R$ {sale.totalAmount.toFixed(2)}</Text>
        </View>
        <Text style={styles.subtitle}>{sale.clientName} • {sale.employeeName}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnReceipt} onPress={onViewReceipt}>
          <Ionicons name="receipt-outline" size={td(16)} color="#475569" />
          <Text style={styles.textReceipt}>Visualizar Comprovante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: td(12),
    padding: l(16),
    marginBottom: a(12),
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: '#FF7A00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(12) },
  timeGroup: { backgroundColor: '#F8FAFC', paddingHorizontal: l(8), paddingVertical: a(4), borderRadius: td(6) },
  time: { fontSize: td(12), fontFamily: fonts.robotoBold, color: Colors.corText },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(8),
    paddingVertical: a(4),
    borderRadius: td(12),
    backgroundColor: '#FFF1E6',
    borderWidth: 1,
    borderColor: '#FFD6B3',
  },
  badgeText: { fontSize: td(10), fontFamily: fonts.robotoBold, color: '#FF7A00' },
  content: { marginBottom: a(4) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(4) },
  title: { flex: 1, fontSize: td(15), fontFamily: fonts.robotoMedium, color: Colors.corTextTitle, marginRight: l(8) },
  amount: { fontSize: td(15), fontFamily: fonts.robotoBold, color: '#16A34A' },
  subtitle: { fontSize: td(12), fontFamily: fonts.robotoRegular, color: Colors.corTextSecondary },
  actionRow: { marginTop: a(12), paddingTop: a(12), borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btnReceipt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: l(6),
    paddingVertical: a(8),
    borderRadius: td(8),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textReceipt: { fontSize: td(12), fontFamily: fonts.robotoMedium, color: '#475569' },
});