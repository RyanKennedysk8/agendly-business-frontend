import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface Props {
  todayRevenue: number;
  todayCompletedCount: number;
  pendingActionCount: number;
  onPressPending: () => void;
}

export const CashSummaryBanner: React.FC<Props> = ({
  todayRevenue,
  todayCompletedCount,
  pendingActionCount,
  onPressPending,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.mainCard}>
        <View style={styles.revenueSection}>
          <Text style={styles.label}>CAIXA DE HOJE</Text>
          <Text style={styles.revenueValue}>R$ {todayRevenue.toFixed(2)}</Text>
          <Text style={styles.subText}>{todayCompletedCount} transações concluídas hoje</Text>
        </View>

        {pendingActionCount > 0 && (
          <TouchableOpacity style={styles.pendingAlert} onPress={onPressPending} activeOpacity={0.8}>
            <View style={styles.pendingIconBox}>
              <Ionicons name="alert-circle" size={td(18)} color="#FF7A00" />
            </View>
            <View>
              <Text style={styles.pendingCount}>{pendingActionCount} pendente{pendingActionCount > 1 ? 's' : ''}</Text>
              <Text style={styles.pendingHint}>Toque p/ filtrar</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: l(16),
    paddingTop: a(8),
    paddingBottom: a(12),
  },
  mainCard: {
    backgroundColor: '#1b1b1b', // Tom escuro da identidade visual
    borderRadius: td(14),
    padding: l(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueSection: {
    flex: 1,
  },
  label: {
    fontSize: td(10),
    fontFamily: fonts.robotoBold,
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  revenueValue: {
    fontSize: td(22),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
    marginTop: a(2),
  },
  subText: {
    fontSize: td(11),
    fontFamily: fonts.robotoRegular,
    color: '#CBD5E1',
    marginTop: a(2),
  },
  pendingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FF7A00',
    paddingHorizontal: l(12),
    paddingVertical: a(8),
    borderRadius: td(10),
    gap: l(8),
  },
  pendingIconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingCount: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: '#FF7A00',
  },
  pendingHint: {
    fontSize: td(10),
    fontFamily: fonts.robotoRegular,
    color: '#CBD5E1',
  },
});