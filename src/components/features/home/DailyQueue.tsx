// src/components/home/DailyQueue.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';

export interface QueueItemType {
  id: string;
  clientName: string;
  service: string;
  time: string;
  status: 'waiting' | 'in_progress' | 'completed';
}

interface DailyQueueProps {
  queue: QueueItemType[];
  onViewAll: () => void;
  onItemAction: (id: string) => void;
}

export const DailyQueue: React.FC<DailyQueueProps> = ({ queue, onViewAll, onItemAction }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Fila do Dia</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.linkText}>Ver Agenda</Text>
        </Pressable>
      </View>

      <View style={styles.queueContainer}>
        {queue.map((item, index) => (
          <View key={item.id} style={[styles.queueItem, index === queue.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.queueTimeBox}>
              <Text style={styles.queueTimeText}>{item.time}</Text>
            </View>
            <View style={styles.queueDetails}>
              <Text style={styles.queueClientName}>{item.clientName}</Text>
              <Text style={styles.queueService}>{item.service}</Text>
            </View>
            <Pressable style={styles.queueActionBtn} onPress={() => onItemAction(item.id)}>
              <Ionicons name="checkmark-circle-outline" size={td(24)} color="#757575" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { 
    marginBottom: a(32) 
},
  sectionHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    marginBottom: a(16) 
},
  sectionTitle: { 
    fontSize: td(18), 
    fontWeight: '700', 
    color: '#1E293B' 
},
  linkText: { 
    fontSize: td(14), 
    fontWeight: '600', 
    color: '#2563EB' 
},
  queueContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    paddingHorizontal: l(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
},
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: a(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
},
  queueTimeBox: { 
    backgroundColor: '#F1F5F9', 
    paddingVertical: a(6), 
    paddingHorizontal: l(10), 
    borderRadius: td(8), 
    marginRight: l(16) 
},
  queueTimeText: { 
    fontSize: td(14), 
    fontWeight: '700', 
    color: '#334155' 
},
  queueDetails: { 
    flex: 1 
},
  queueClientName: { 
    fontSize: td(15), 
    fontWeight: '600', 
    color: '#0F172A', 
    marginBottom: a(2) 
},
  queueService: { 
    fontSize: td(13), 
    color: '#64748B' 
},
  queueActionBtn: { 
    padding: td(8) 
},
});