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
  const dayStr = new Date(item.startTime).toLocaleDateString('pt-BR', { day: '2-digit' });
  const monStr = new Date(item.startTime).toLocaleDateString('pt-BR', { month: 'short' })
  .replace('.', '').replace(/^./, (char) => char.toUpperCase());
  const timeStr = new Date(item.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
          <View>
            <Text style={styles.client}>{item.clientName}</Text>
            <Text style={styles.service}>{item.serviceName}</Text>
            <Text style={styles.employee}>Com: {item.employeeName || 'Sem profissional'}</Text>
          </View>
          <View style={styles.containerDateHours}>
                <Text style={styles.txtMonStr}>{monStr}</Text>
                <Text style={styles.txtDayStr}>{dayStr}</Text>
                <Text style={styles.txtTimeStr}>{timeStr}</Text>
          </View>
      </View>


      {isPendingAction && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.btnNoShow]} onPress={onNoShow}>
            <Text style={styles.textNoShow}>Não Compareceu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnComplete]} onPress={onComplete}>
            <Text style={styles.textComplete}>Confirmar serviço</Text>
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
    borderRadius: td(2),
    padding: l(16),
    marginBottom: a(12),
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(12),
  },
  timeGroup: {
    backgroundColor: Colors.corContainer,
    paddingHorizontal: l(5),
    paddingVertical: a(4),
    borderRadius: td(4),
  },
  time: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(5),
    paddingVertical: a(4),
    borderRadius: td(8),
    borderWidth: 1,
  },
  badgeText: {
    fontSize: td(10),
    fontFamily: fonts.robotoBold,
  },
  content: {
    marginBottom: a(4),
    flexDirection:"row",
    justifyContent:"space-between"
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
    marginTop: a(10),
    paddingTop: a(10),
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: a(8),
    borderRadius: td(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnNoShow: {
    backgroundColor: Colors.corButtonOff,
    borderColor: Colors.corButtonDisable,
  },
  textNoShow: {
    color: Colors.corButton,
    fontFamily: fonts.robotoMedium,
    fontSize: td(12),
  },
  btnComplete: {
    backgroundColor: Colors.corButton,
    borderColor: Colors.corButton,
  },
  textComplete: {
    color: Colors.white,
    fontFamily: fonts.robotoMedium,
    fontSize: td(12),
  },
  btnReceipt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: l(6),
    paddingVertical: a(8),
    borderRadius: td(6),
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textReceipt: {
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    color: '#475569',
  },

  containerDateHours:{
    paddingRight:l(15), 
    justifyContent:"center", 
    alignItems:"center"
  },
  txtMonStr:{
    fontSize:td(12), 
    color:Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular
  },
  txtDayStr:{
    fontSize:td(17), 
    marginVertical:a(1), 
    color:Colors.corText, 
    fontFamily: fonts.robotoMedium
  },
  txtTimeStr:{
    fontSize:td(12), 
    color:Colors.corTextSecondary, 
    fontFamily: fonts.robotoRegular
  },
});