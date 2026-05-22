// src/components/features/home/TeamOverview.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

// O DTO que o componente exige (Status em tempo real)
export interface EmployeeStatusDTO {
  id: string;
  name: string;
  photoUrl?: string | null;
  status: 'free' | 'working';
  currentService?: string; 
  busyUntil?: string;      
}

interface TeamOverviewProps {
  team: EmployeeStatusDTO[];
  onViewAll: () => void;
  onEmployeePress: (id: string) => void;
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({ team, onViewAll, onEmployeePress }) => {
  
  const displayTeam = useMemo(() => {
    return [...team]
      .sort((empA, empB) => {
        if (empA.status === 'working' && empB.status === 'free') return -1;
        if (empA.status === 'free' && empB.status === 'working') return 1;
        return empA.name.localeCompare(empB.name);
      })
      .slice(0, 3);
  }, [team]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Equipe em Tempo Real</Text>
        <Pressable onPress={onViewAll} hitSlop={10}>
          <Text style={styles.linkText}>Ver todos</Text>
        </Pressable>
      </View>

      <View style={styles.cardContainer}>
        {displayTeam.map((employee, index) => {
          const isWorking = employee.status === 'working';
          const isLast = index === displayTeam.length - 1;

          return (
            <Pressable 
              key={employee.id}
              style={[styles.employeeRow, !isLast && styles.rowBorder]}
              onPress={() => onEmployeePress(employee.id)}
            >
              <View style={styles.avatarContainer}>
                {employee.photoUrl ? (
                  <Image source={{ uri: employee.photoUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarLetter}>
                      {employee.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={[styles.statusDot, { backgroundColor: isWorking ? '#F59E0B' : '#10B981' }]} />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.employeeName} numberOfLines={1}>{employee.name}</Text>
                
                {isWorking ? (
                  <View style={styles.statusWrapper}>
                    <Ionicons name="cut-outline" size={td(12)} color="#F59E0B" />
                    <Text style={styles.statusWorking} numberOfLines={1}>
                      {employee.currentService} • até {employee.busyUntil}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.statusWrapper}>
                    <Ionicons name="checkmark-circle-outline" size={td(12)} color="#10B981" />
                    <Text style={styles.statusFree}>Disponível agora</Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={td(18)} color="#CBD5E1" />
            </Pressable>
          );
        })}

        {displayTeam.length === 0 && (
          <Text style={styles.emptyText}>Nenhum funcionário cadastrado.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: a(24) }, 
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: a(12) },
  sectionTitle: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#1E293B' },
  linkText: { fontSize: td(13), fontFamily: fonts?.robotoMedium || 'System', color: '#2563EB' },
  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: td(16), borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  employeeRow: { flexDirection: 'row', alignItems: 'center', padding: td(16), backgroundColor: '#FFFFFF' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  avatarContainer: { position: 'relative', marginRight: l(12) },
  avatar: { width: td(40), height: td(40), borderRadius: td(20), backgroundColor: '#E2E8F0' },
  avatarFallback: { justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#64748B' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: td(12), height: td(12), borderRadius: td(6), borderWidth: 2, borderColor: '#FFFFFF' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  employeeName: { fontSize: td(15), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A', marginBottom: a(2) },
  statusWrapper: { flexDirection: 'row', alignItems: 'center', gap: l(4) },
  statusWorking: { fontSize: td(13), fontFamily: fonts?.robotoMedium || 'System', color: '#F59E0B', flex: 1 },
  statusFree: { fontSize: td(13), fontFamily: fonts?.robotoMedium || 'System', color: '#10B981' },
  emptyText: { padding: td(16), textAlign: 'center', color: '#94A3B8', fontSize: td(13), fontFamily: fonts?.robotoMedium || 'System' }
});