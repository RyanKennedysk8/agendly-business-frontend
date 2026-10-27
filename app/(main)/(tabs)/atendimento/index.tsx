import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Alert 
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useAttendanceHistory } from '@/hooks/useAttendanceHistory';
import { useStandaloneSales } from '@/hooks/useStandaloneSales';
import { useCompanyExpenses, ExpenseCategory } from '@/hooks/useCompanyExpenses';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCartStore } from '@/store/useCartStore';
import { getDisplayStatus } from '@/utils/appointmentUtils';
import { EmptyList } from '@/components/shared/EmptyList';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native';
import { formatDateLabel } from '@/utils/formatDateLabel';

type LedgerFilter = 'ALL' | 'INCOME' | 'EXPENSE';

type LedgerEntry =
  | { type: 'header'; id: string; dateLabel: string }
  | { 
      type: 'transaction'; 
      id: string; 
      kind: 'INCOME' | 'EXPENSE'; 
      title: string; 
      subtitle: string; 
      amount: number; 
      timestamp: number;
      appointmentId?: string;
      saleId?: string;
    };

const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'SUPPLIES', label: 'Produtos / Insumos', icon: 'cube-outline' },
  { id: 'OPERATIONAL', label: 'Operacional / Loja', icon: 'construct-outline' },
  { id: 'UTILITIES', label: 'Contas Fixas', icon: 'flash-outline' },
  { id: 'OTHER', label: 'Outros', icon: 'ellipsis-horizontal-circle-outline' },
];

export default function AtendimentoHubScreen() {
  const router = useRouter();
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>('ALL');

  const { data: company } = useMyCompany();
  const { data: appointments = [], isLoading: loadingAppts, refetch: refetchAppts } = useAttendanceHistory();
  const activeCompanyId = company?.id || appointments[0]?.companyId;

  const { data: standaloneSales = [], isLoading: loadingSales, refetch: refetchSales } = useStandaloneSales(activeCompanyId);
  const { data: expenses = [], isLoading: loadingExpenses, refetch: refetchExpenses } = useCompanyExpenses(activeCompanyId);

  const handleRefresh = () => {
    refetchAppts();
    refetchSales();
    refetchExpenses();
  };

  const { metrics, ledgerList } = useMemo(() => {
    let pendingCheckoutsCount = 0;
    let inProgressCount = 0;

    const rawTransactions: Exclude<LedgerEntry, { type: 'header' }>[] = [];

    appointments.forEach(appt => {
      const status = getDisplayStatus(appt);
      if (status === 'AWAITING_COMPLETION') pendingCheckoutsCount += 1;
      if (status === 'IN_PROGRESS') inProgressCount += 1;

      if (status === 'COMPLETED' && (ledgerFilter === 'ALL' || ledgerFilter === 'INCOME')) {
        const amount = Number((appt as any).finalPrice ?? appt.priceAtBooking ?? 0);
        rawTransactions.push({
          type: 'transaction',
          id: `inc-appt-${appt.appointmentId}`,
          kind: 'INCOME',
          title: appt.serviceName,
          subtitle: `${appt.clientName}\n${appt.employeeName || 'Equipe'}`,
          amount,
          timestamp: new Date(appt.startTime).getTime(),
          appointmentId: appt.appointmentId,
        });
      }
    });

    if (ledgerFilter === 'ALL' || ledgerFilter === 'INCOME') {
      standaloneSales.forEach(sale => {
        const amount = Number(sale.totalAmount || 0);
        const summary = sale.items.map(i => `${i.quantity}x ${i.description}`).join(', ');
        rawTransactions.push({
          type: 'transaction',
          id: `inc-sale-${sale.saleId}`,
          kind: 'INCOME',
          title: summary || 'Venda PDV',
          subtitle: `Venda de Balcão • ${sale.paymentMethod}`,
          amount,
          timestamp: new Date(sale.createdAt).getTime(),
          saleId: sale.saleId,
        });
      });
    }

    if (ledgerFilter === 'ALL' || ledgerFilter === 'EXPENSE') {
      expenses.forEach(exp => {
        const amount = Number(exp.amount || 0);
        const catLabel = EXPENSE_CATEGORIES.find(c => c.id === exp.category)?.label || 'Despesa';
        rawTransactions.push({
          type: 'transaction',
          id: `exp-${exp.id}`,
          kind: 'EXPENSE',
          title: exp.description,
          subtitle: `Saída • ${catLabel}`,
          amount,
          timestamp: new Date(exp.createdAt).getTime(),
        });
      });
    }

    rawTransactions.sort((aObj, bObj) => bObj.timestamp - aObj.timestamp); 

    const grouped: LedgerEntry[] = [];
    let currentDateKey = '';

    rawTransactions.forEach(tx => {
      const txDate = new Date(tx.timestamp);
      const dateKey = `${txDate.getFullYear()}-${txDate.getMonth()}-${txDate.getDate()}`;

      if (dateKey !== currentDateKey) {
        grouped.push({
          type: 'header',
          id: `hdr-${dateKey}`,
          dateLabel: formatDateLabel(tx.timestamp),
        });
        currentDateKey = dateKey;
      }
      grouped.push(tx);
    });

    return {
      metrics: { pendingCheckoutsCount, inProgressCount },
      ledgerList: grouped,
    };
  }, [appointments, standaloneSales, expenses, ledgerFilter]);

  const handleQuickSale = () => {
    const { clearCart, setContext } = useCartStore.getState();
    clearCart();
    setContext(activeCompanyId || null, null, null);
    router.push('/(main)/(stack)/checkout' as any); 
  };

  const handleQuickExpense = () => {
    // Roteamento para a nova tela na Stack
    router.push('/(main)/(stack)/expense' as any);
  };

  const renderPendingBanner = () => (
    <TouchableOpacity 
      style={[
        styles.pendingBanner, 
        metrics.pendingCheckoutsCount === 0 && styles.pendingBannerClean
      ]} 
      onPress={() => router.push('/(main)/(stack)/pendencias' as any)}
    >
      <View style={styles.pendingBannerLeft}>
        <View style={[
          styles.pendingBadgeIcon,
          metrics.pendingCheckoutsCount === 0 && { backgroundColor: '#DCFCE7' }
        ]}>
          <Ionicons 
            name={metrics.pendingCheckoutsCount > 0 ? "time" : "checkmark-done"} 
            size={td(20)} 
            color={metrics.pendingCheckoutsCount > 0 ? "#FF7A00" : "#16A34A"} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pendingBannerTitle}>
            {metrics.pendingCheckoutsCount > 0 
              ? `${metrics.pendingCheckoutsCount} atendimento${metrics.pendingCheckoutsCount > 1 ? 's' : ''} aguardando checkout`
              : 'Nenhum checkout atrasado!'}
          </Text>
          <Text style={styles.pendingBannerSub}>
            {metrics.inProgressCount > 0 
              ? `${metrics.inProgressCount} cliente(s) em atendimento agora • Toque p/ gerenciar`
              : 'Toque para gerenciar a fila de atendimentos'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={td(18)} color={Colors.corTextSecondary} />
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsRow}>
      <TouchableOpacity style={styles.btnQuickSale} activeOpacity={0.85} onPress={handleQuickSale}>
        <Ionicons name="cart-outline" size={td(18)} color={Colors.white} />
        <Text style={styles.btnQuickSaleText}>Nova Venda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnQuickExpense} activeOpacity={0.85} onPress={handleQuickExpense}>
        <Ionicons name="remove-circle-outline" size={td(18)} color={Colors.corScreen} />
        <Text style={styles.btnQuickExpenseText}>Lançar Gasto</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLedgerFilters = () => (
    <View style={styles.ledgerHeaderRow}>
      <Text style={styles.ledgerSectionTitle}>Histórico</Text>
      <View style={styles.miniPills}>
        {(['ALL', 'INCOME', 'EXPENSE'] as LedgerFilter[]).map((f) => {
          const active = ledgerFilter === f;
          const label = f === 'ALL' ? 'Tudo' : f === 'INCOME' ? 'Entradas' : 'Saídas';
          return (
            <TouchableOpacity 
              key={f} 
              style={[styles.miniPill, active && styles.miniPillActive]} 
              onPress={() => setLedgerFilter(f)}
            >
              <Text style={[styles.miniPillText, active && styles.miniPillTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderLedgerItem = ({ item }: { item: LedgerEntry }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{item.dateLabel}</Text>
        </View>
      );
    }

    const isIncome = item.kind === 'INCOME';
    const timeStr = new Date(item.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.txCard}
        activeOpacity={isIncome ? 0.7 : 1}
        onPress={() => {
          if (item.appointmentId) {
            router.push({ pathname: '/(main)/(stack)/receipt' as any, params: { appointmentId: item.appointmentId } });
          } else if (item.saleId) {
            router.push({ pathname: '/(main)/(stack)/receipt' as any, params: { saleId: item.saleId } });
          }
        }}
      >
        <View style={[styles.txIconBox, isIncome ? styles.txIconIncome : styles.txIconExpense]}>
          {isIncome ? <BanknoteArrowDown size={td(18)} color={Colors.success}/> : <BanknoteArrowUp size={td(18)} color={Colors.corText}/>}
        </View>

        <View style={styles.txMiddle}>
          <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.txSubtitle} numberOfLines={1}>
            {timeStr} • {item.subtitle}
          </Text>
        </View>

        <View style={styles.txRight}>
          <Text style={[styles.txAmount, isIncome ? styles.txAmountIncome : styles.txAmountExpense]}>
            {isIncome ? '+' : '-'} R$ {item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Caixa & Operação',
          headerType: 'attendanceMain',
          attendanceParams: {
            rightLabel: 'Balanço',
            rightIcon: 'bar-chart-outline',
            onRightPress: () => Alert.alert('Em breve', 'Stack de Gestão Financeira detalhada será conectada aqui.'),
          }
        } as any} 
      />
      <View style={styles.listWrapper}>
        <FlashList
          data={ledgerList}
          keyExtractor={(item) => item.id}
          getItemType={(item) => item.type}
          contentContainerStyle={styles.listContent}
          refreshing={loadingAppts || loadingSales || loadingExpenses}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ 
            <View style={styles.topSection}>
              {renderPendingBanner()}
              {renderQuickActions()}
              {renderLedgerFilters()}
            </View>
          }
          renderItem={renderLedgerItem}
          ListEmptyComponent={
            <EmptyList 
              message="Sem movimentações" 
              subMessage="Nenhuma entrada ou saída registrada para este filtro."
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topSection: {
    backgroundColor: Colors.white,
    paddingTop: a(8),
    paddingBottom: a(15),
    marginHorizontal: l(5),
  },

  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    marginHorizontal: l(10),
    borderRadius: td(12),
    padding: l(12),
    marginBottom: a(12),
  
    
    
  }, 
  pendingBannerClean: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.border,
    
  },
  pendingBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(10),
    flex: 1,
    
  },
  pendingBadgeIcon: {
    width: td(40),
    height: td(40),
    borderRadius: td(8),
    backgroundColor: 'rgba(255, 122, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingBannerTitle: {
    fontSize: td(13),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
  },
  pendingBannerSub: {
    fontSize: td(11),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(2),
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: l(10),
    marginBottom: a(14),
    marginHorizontal: l(10),
    
  },
  btnQuickSale: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: l(6),
    backgroundColor: Colors.corScreen,
    height: a(44),
    borderRadius: td(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  },
  btnQuickSaleText: {
    fontSize: td(13),
    fontFamily: fonts.robotoBold,
    color: Colors.white,
  },
  btnQuickExpense: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: l(6),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    height: a(44),
    borderRadius: td(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  },
  btnQuickExpenseText: {
    fontSize: td(13),
    fontFamily: fonts.robotoBold,
    color: Colors.corScreen,
  },

  ledgerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: a(4),
    marginHorizontal: l(10),
  },
  ledgerSectionTitle: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
  },
  miniPills: {
    flexDirection: 'row',
    backgroundColor: Colors.corContainer,
    borderRadius: td(8),
    padding: l(2),
  },
  miniPill: {
    paddingHorizontal: l(10),
    paddingVertical: a(4),
    borderRadius: td(6),
  },
  miniPillActive: {
    backgroundColor: Colors.white,
  },
  miniPillText: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },
  miniPillTextActive: {
    color: Colors.corTextTitle,
    fontFamily: fonts.robotoBold,
  },

  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingVertical: a(12),
  },
  dateHeader: {
    marginTop: a(8),
    marginBottom: a(8),
    marginHorizontal: l(15),
  },
  dateHeaderText: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary,
  },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: l(10),
    marginHorizontal: l(5),
    borderRadius: td(12),
    marginBottom: a(8),
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  txIconBox: {
    width: td(40),
    height: td(40),
    borderRadius: td(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: l(12),
  },
  txIconIncome: {
    backgroundColor: Colors.successDisable,
  },
  txIconExpense: {
    backgroundColor: Colors.corContainer,
  },
  txMiddle: {
    flex: 1,
    marginRight: l(8),
  },
  txTitle: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
  },
  txSubtitle: {
    fontSize: td(11),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
    marginTop: a(2),
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
  },
  txAmountIncome: {
    color: Colors.success,
  },
  txAmountExpense: {
    color: Colors.corText,
  },
});