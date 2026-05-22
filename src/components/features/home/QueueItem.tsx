// src/components/home/QueueItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

export type QueueStatus = 'waiting' | 'in_progress' | 'completed';

export interface QueueItemType {
  id: string;
  clientName?: string;
  service?: string;
  time?: string;
  status: QueueStatus;

  // 🔥 Backend ready
  client?: {
    id: string;
    name: string;
    phone?: string;
  };
  serviceData?: {
    id: string;
    name: string;
    duration?: number;
    price?: number;
  };
  professional?: {
    id: string;
    name: string;
  };
  dateTime?: string;
}

interface Props {
  item: QueueItemType;
  isLast: boolean;
  onAction: (id: string) => void;
}

// 🎨 helpers
const getStatusColor = (status: QueueStatus) => {
  switch (status) {
    case 'waiting':
      return '#94A3B8';
    case 'in_progress':
      return '#3B82F6';
    case 'completed':
      return '#22C55E';
    default:
      return '#94A3B8';
  }
};

const getStatusIcon = (status: QueueStatus) => {
  switch (status) {
    case 'waiting':
      return 'time-outline';
    case 'in_progress':
      return 'play-circle-outline';
    case 'completed':
      return 'checkmark-circle';
    default:
      return 'ellipse-outline';
  }
};

const getStatusLabel = (status: QueueStatus) => {
  switch (status) {
    case 'waiting':
      return 'Aguardando';
    case 'in_progress':
      return 'Em atendimento';
    case 'completed':
      return 'Finalizado';
  }
};

// 🧠 formatador de hora
const formatTime = (dateTime?: string, fallback?: string) => {
  if (!dateTime) return fallback || '--:--';

  const date = new Date(dateTime);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const QueueItem: React.FC<Props> = ({ item, isLast, onAction }) => {
  const statusColor = getStatusColor(item.status);

  // 🔥 Fallback inteligente (mock antigo + novo)
  const clientName = item.client?.name || item.clientName || 'Cliente';
  const serviceName = item.serviceData?.name || item.service || 'Serviço';
  const professionalName = item.professional?.name || 'Profissional';
  const time = formatTime(item.dateTime, item.time);

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderLeftColor: statusColor,
        },
      ]}
    >
      {/* ⏰ Horário */}
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      {/* 📄 Informações */}
      <View style={styles.details}>
        <Text style={styles.clientName}>{clientName}</Text>

        <Text style={styles.service}>{serviceName}</Text>

        {/* 👤 Profissional */}
        <View style={styles.professionalRow}>
          <Text style={styles.professional}>{professionalName}</Text>
        </View>

        {/* Status */}
        <Text style={[styles.status, { color: statusColor }]}>
          {getStatusLabel(item.status)}
        </Text>
      </View>

      {/* ⚡ Ação */}
      <Pressable
        style={[
          styles.actionBtn,
          item.status === 'completed' && { opacity: 0.4 },
        ]}
        onPress={() => onAction(item.id)}
        disabled={item.status === 'completed'}
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

    // 🔥 destaque lateral (nível app premium)
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
    fontFamily:fonts.robotoBold,
    color: Colors.corText,
  },

  details: {
    flex: 1,
  },

  clientName: {
    fontSize: td(13),
    fontFamily:fonts.robotoMedium,
    color: Colors.corText,
  },

  service: {
    fontSize: td(15),
    fontFamily:fonts.robotoMedium,
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