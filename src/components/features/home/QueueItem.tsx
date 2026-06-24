import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

import {
  AppointmentDetail,
  AppointmentStatus,
} from '@/types/appointments';

interface Props {
  item: AppointmentDetail;
  isLast: boolean;
  onAction: (appointmentId: string) => void;
}

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return '#94A3B8';

    case AppointmentStatus.AWAITING_COMPLETION:
      return '#3B82F6';

    case AppointmentStatus.COMPLETED:
      return '#22C55E';

    case AppointmentStatus.PENDING_CONFIRMATION:
      return '#F59E0B';

    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_COMPANY:
    case AppointmentStatus.NO_SHOW:
      return '#EF4444';

    default:
      return '#94A3B8';
  }
};

const getStatusLabel = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'Aguardando';

    case AppointmentStatus.AWAITING_COMPLETION:
      return 'Em atendimento';

    case AppointmentStatus.COMPLETED:
      return 'Finalizado';

    case AppointmentStatus.PENDING_CONFIRMATION:
      return 'Pendente';

    case AppointmentStatus.CANCELLED_BY_CLIENT:
      return 'Cancelado';

    case AppointmentStatus.CANCELLED_BY_COMPANY:
      return 'Cancelado';

    case AppointmentStatus.NO_SHOW:
      return 'Não compareceu';
  }
};

const getStatusIcon = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'time-outline';

    case AppointmentStatus.AWAITING_COMPLETION:
      return 'play-circle-outline';

    case AppointmentStatus.COMPLETED:
      return 'checkmark-circle';

    case AppointmentStatus.PENDING_CONFIRMATION:
      return 'help-circle-outline';

    case AppointmentStatus.CANCELLED_BY_CLIENT:
    case AppointmentStatus.CANCELLED_BY_COMPANY:
      return 'close-circle';

    case AppointmentStatus.NO_SHOW:
      return 'alert-circle';

    default:
      return 'ellipse-outline';
  }
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const QueueItem: React.FC<Props> = ({
  item,
  isLast,
  onAction,
}) => {
  const statusColor = getStatusColor(item.status);

  const disabled =
    item.status === AppointmentStatus.COMPLETED ||
    item.status === AppointmentStatus.CANCELLED_BY_CLIENT ||
    item.status === AppointmentStatus.CANCELLED_BY_COMPANY ||
    item.status === AppointmentStatus.NO_SHOW;

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderLeftColor: item.employeeColor ?? statusColor,
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
          {item.companyName}
        </Text>

        <Text style={styles.service}>
          {item.serviceName}
        </Text>

        <View style={styles.professionalRow}>
          <Text style={styles.professional}>
            {item.employeeName ?? 'Sem profissional'}
          </Text>
        </View>

        <Text
          style={[
            styles.status,
            {
              color: statusColor,
            },
          ]}
        >
          {getStatusLabel(item.status)}
        </Text>
      </View>

      <Pressable
        style={[
          styles.actionBtn,
          disabled && {
            opacity: 0.4,
          },
        ]}
        onPress={() => onAction(item.appointmentId)}
        disabled={disabled}
      >
        <Ionicons
          name={getStatusIcon(item.status)}
          size={td(24)}
          color={statusColor}
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
    fontSize: td(10),
    color: Colors.corTextSecondary,
    fontFamily: fonts.robotoMedium,
  },

  status: {
    fontSize: td(11),
    marginTop: a(2),
    fontFamily: fonts.robotoMedium,
  },

  actionBtn: {
    padding: td(8),
  },
});