import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { AppointmentDetail } from '@/types/appointments';
import { getThemeForAppointment, getStatusLabel, getStatusIcon } from '@/utils/appointmentUtils';
import { Colors, AppointmentStatus } from '@/colors/color';

interface Props {
  item: AppointmentDetail;
  onComplete: () => void;
  onNoShow: () => void;
  onViewReceipt: () => void;
} 

const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const AttendanceCard: React.FC<Props> = ({ item, onComplete, onNoShow, onViewReceipt }) => {
  const { status, theme } = getThemeForAppointment(item);
  const isPendingAction = status === AppointmentStatus.AWAITING_COMPLETION;
  const isCompleted = status === AppointmentStatus.COMPLETED;

  return (
    <View style={[styles.card, { borderLeftColor: theme.text }]}>
      <View style={styles.header}>
        <View style={styles.timeGroup}>
          <Text style={styles.time}>{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <Ionicons name={getStatusIcon(status)} size={td(12)} color={theme.text} style={{ marginRight: l(4) }} />
          <Text style={[styles.badgeText, { color: theme.text }]}>{getStatusLabel(status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.client}>{item.clientName}</Text>
        <Text style={styles.service}>{item.serviceName}</Text>
        <Text style={styles.employee}>Com: {item.employeeName || 'Sem profissional'}</Text>
      </View>

      {isPendingAction && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.btnNoShow]} onPress={onNoShow}>
            <Text style={styles.textNoShow}>Não Compareceu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnComplete]} onPress={onComplete}>
            <Text style={styles.textComplete}>Finalizar & Caixa</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCompleted && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnReceipt} onPress={onViewReceipt}>
            <Ionicons name="receipt-outline" size={td(16)} color="#475569" />
            <Text style={styles.textReceipt}>Visualizar Recibo / Detalhes</Text>
          </TouchableOpacity>
        </View>
      )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(12),
  },
  timeGroup: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: l(8),
    paddingVertical: a(4),
    borderRadius: td(6),
  },
  time: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(8),
    paddingVertical: a(4),
    borderRadius: td(12),
    borderWidth: 1,
  },
  badgeText: {
    fontSize: td(10),
    fontFamily: fonts.robotoBold,
  },
  content: {
    marginBottom: a(4),
  },
  client: {
    fontSize: td(16),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextTitle,
    marginBottom: a(4),
  },
  service: {
    fontSize: td(14),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextInfo,
    marginBottom: a(2),
  },
  employee: {
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: l(8),
    marginTop: a(12),
    paddingTop: a(12),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: a(10),
    borderRadius: td(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnNoShow: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  textNoShow: {
    color: '#E11D48',
    fontFamily: fonts.robotoMedium,
    fontSize: td(13),
  },
  btnComplete: {
    backgroundColor: '#FF7A00',
    borderColor: '#FF7A00',
  },
  textComplete: {
    color: Colors.white,
    fontFamily: fonts.robotoMedium,
    fontSize: td(13),
  },
  btnReceipt: {
    flex: 1,
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
  textReceipt: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: '#475569',
  },
});