import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { AppointmentDetail } from '@/types/appointments';
import { QueueItem } from './QueueItem';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';

interface DailyQueueProps {
  queue: AppointmentDetail[];
  onViewAll: () => void;
  onItemAction: (appointmentId: string) => void;
}

export const DailyQueue: React.FC<DailyQueueProps> = ({
  queue,
  onViewAll,
  onItemAction,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Fila do Dia</Text>

        <Pressable onPress={onViewAll} style={styles.btnViewAll}>
          <Text style={styles.link}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={td(16)} color={Colors.corButton} />
        </Pressable>
      </View>

      <View style={[styles.container, queue.length === 0 && styles.containerEmpty]}>
        {queue.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="cafe-outline" size={td(32)} color={Colors.corTextInfo} />
            </View>
            <Text style={styles.emptyTitle}>Tudo tranquilo por aqui!</Text>
            <Text style={styles.emptySubtitle}>
              Nenhum agendamento previsto para hoje. Aproveite para organizar a loja ou adicionar um cliente manualmente.
            </Text>
          </View>
        ) : (
          <FlashList
            data={queue}
            keyExtractor={(item) => item.appointmentId}
            renderItem={({ item, index }) => (
              <QueueItem
                item={item}
                isLast={index === queue.length - 1}
                onAction={onItemAction}
              />
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: a(32),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: a(16),
    marginHorizontal: l(5),
  },
  title: {
    fontSize: td(16),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  btnViewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(2),
  },
  link: {
    fontSize: td(13),
    fontFamily: fonts.robotoMedium,
    color: Colors.corButton,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    paddingHorizontal: l(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  containerEmpty: {
    paddingHorizontal: 0,
    borderStyle: 'dashed', // Estilo tracejado combina muito com estados vazios
    backgroundColor: '#F8FAFC',
  },
  emptyState: {
    paddingVertical: a(40),
    paddingHorizontal: l(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBox: {
    width: td(64),
    height: td(64),
    borderRadius: td(32),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: a(16),
  },
  emptyTitle: {
    fontSize: td(16),
    fontFamily: fonts.robotoBold,
    color: Colors.corTextTitle,
    marginBottom: a(8),
  },
  emptySubtitle: {
    fontSize: td(13),
    fontFamily: fonts.robotoRegular,
    color: Colors.corTextInfo,
    textAlign: 'center',
    lineHeight: td(20),
  },
});