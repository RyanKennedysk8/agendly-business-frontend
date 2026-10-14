import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors, AppointmentStatus, StatusTheme } from '@/colors/color';

import { AppointmentDetail } from '@/types/appointments';
import { getDisplayStatus, getStatusIcon, getStatusLabel, getThemeForAppointment } from '@/utils/appointmentUtils';

interface Props {
  item: AppointmentDetail;
  isLast: boolean;
  onAction: (appointmentId: string) => void;
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const QueueItem: React.FC<Props> = ({
  item,
  isLast,
  onAction,
}) => {
  const { status: displayStatus, theme } = getThemeForAppointment(item);

  const disabled =
    displayStatus === AppointmentStatus.COMPLETED ||
    displayStatus === AppointmentStatus.CANCELLED_BY_CLIENT ||
    displayStatus === AppointmentStatus.CANCELLED_BY_COMPANY ||
    displayStatus === AppointmentStatus.NO_SHOW;

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderLeftColor: theme.text, 
        },
      ]}
    >
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>
          {formatTime(item.startTime)}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.clientName}>
          {item.clientName}
        </Text>

        <Text style={styles.service}>
          {item.serviceName}
        </Text>

        <View style={styles.professionalRow}>
          <Text style={styles.professional}>
            Com: {item.employeeName ?? 'Sem profissional'}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <Text style={[styles.statusText, { color: theme.text }]}>
            {getStatusLabel(displayStatus)}
          </Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.actionBtn,
          disabled && { opacity: 0.4 },
        ]}
        onPress={() => onAction(item.appointmentId)}
        disabled={disabled}
      >
        <Ionicons
          name={getStatusIcon(displayStatus)}
          size={td(24)}
          color={theme.text}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(16),
    borderBottomColor: '#F1F5F9',
    borderLeftWidth: 4,
    paddingLeft: l(12),
  },
  timeBox: {
    backgroundColor: '#F1F5F9',
    paddingVertical: a(6),
    paddingHorizontal: l(10),
    borderRadius: td(8),
    marginRight: l(16),
  },
  timeText: {
    fontSize: td(14),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  },
  details: {
    flex: 1,
  },
  clientName: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  service: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: '#64748B',
    marginTop: a(2),
  },
  professionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(4),
    marginTop: a(2),
  },
  professional: {
    fontSize: td(11),
    color: Colors.corTextSecondary,
    fontFamily: fonts.robotoMedium,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: a(6),
    paddingHorizontal: l(8),
    paddingVertical: a(4),
    borderRadius: td(6),
    borderWidth: 1,
  },
  statusText: {
    fontSize: td(10),
    fontFamily: fonts.robotoBold,
  },
  actionBtn: {
    padding: td(8),
  },
});