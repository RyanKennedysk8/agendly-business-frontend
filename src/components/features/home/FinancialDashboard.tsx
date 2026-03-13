// src/components/home/FinancialDashboard.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';

interface FinancialDashboardProps {
  revenue: number;
  expenses: number;
  onViewDetails: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ revenue, expenses, onViewDetails }) => {
  const profit = useMemo(() => revenue - expenses, [revenue, expenses]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Saúde Financeira (Hoje)</Text>
        <Pressable onPress={onViewDetails}>
          <Text style={styles.linkText}>Ver Detalhes</Text>
        </Pressable>
      </View>

      <View style={styles.financialGrid}>
        <View style={[styles.financeCard, styles.profitCard]}>
          <Text style={styles.financeLabelWhite}>Lucro Líquido</Text>
          <Text style={styles.financeValueWhite}>{formatCurrency(profit)}</Text>
        </View>
        
        <View style={styles.financeRow}>
          <View style={[styles.financeCard, styles.subCard]}>
            <View style={styles.financeIconRow}>
              <Ionicons name="arrow-up-circle" size={td(20)} color="#2E7D32" />
              <Text style={styles.financeLabel}>Faturamento</Text>
            </View>
            <Text style={styles.financeValueGreen}>{formatCurrency(revenue)}</Text>
          </View>

          <View style={[styles.financeCard, styles.subCard]}>
            <View style={styles.financeIconRow}>
              <Ionicons name="arrow-down-circle" size={td(20)} color="#D32F2F" />
              <Text style={styles.financeLabel}>Despesas</Text>
            </View>
            <Text style={styles.financeValueRed}>{formatCurrency(expenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: a(32) },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: a(16),
  },
  sectionTitle: { fontSize: td(18), fontWeight: '700', color: '#1E293B' },
  linkText: { fontSize: td(14), fontWeight: '600', color: '#2563EB' },
  financialGrid: { gap: a(12) },
  financeRow: { flexDirection: 'row', gap: l(12) },
  financeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    padding: td(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  profitCard: { backgroundColor: '#0F172A', width: '100%' },
  subCard: { flex: 1 },
  financeIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: a(8), gap: l(6) },
  financeLabelWhite: { fontSize: td(14), color: '#94A3B8', fontWeight: '500', marginBottom: a(4) },
  financeValueWhite: { fontSize: td(32), fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  financeLabel: { fontSize: td(13), color: '#64748B', fontWeight: '600' },
  financeValueGreen: { fontSize: td(20), fontWeight: '700', color: '#2E7D32' },
  financeValueRed: { fontSize: td(20), fontWeight: '700', color: '#D32F2F' },
});