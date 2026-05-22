// src/components/home/DailyQueue.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { QueueItem, QueueItemType } from './QueueItem';

interface DailyQueueProps {
  queue: QueueItemType[];
  onViewAll: () => void;
  onItemAction: (id: string) => void;
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

        <Pressable onPress={onViewAll}>
          <Text style={styles.link}>Ver Agenda</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <QueueItem
              item={item}
              isLast={index === queue.length - 1}
              onAction={onItemAction}
            />
          )}
          scrollEnabled={false}
        />
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
    alignItems: 'baseline',
    marginBottom: a(16),
    marginHorizontal: l(5),
  },
  title: {
    fontSize: td(16),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  link: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: Colors.corScreen,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    paddingHorizontal: l(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});