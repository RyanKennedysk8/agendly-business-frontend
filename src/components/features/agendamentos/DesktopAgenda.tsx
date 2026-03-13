import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { startOfWeek, addDays, subDays, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

import { AppointmentResponseDTO, EmployeeSummaryDTO } from '@type/appointments';
import { td } from '@/constants/responsive';

interface DesktopAgendaProps {
  appointments: AppointmentResponseDTO[];
  staffList: EmployeeSummaryDTO[];
}

// Configurações do Motor Desktop (Valores absolutos para evitar distorção em monitores Ultrawide)
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 90; // Área de clique maior para mouses
const MINUTES_IN_HOUR = 60;
const TIME_COLUMN_WIDTH = 80;
const COLUMN_WIDTH = 280; // Largura fixa ideal para leitura de cards na Web

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * MINUTES_IN_HOUR + m;
};

export const DesktopAgenda: React.FC<DesktopAgendaProps> = ({ appointments, staffList }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const headerScrollRef = useRef<ScrollView>(null);

  // ============================================================================
  // GESTÃO DE DATAS
  // ============================================================================
  const changeDate = useCallback((days: number) => {
    setSelectedDate((prev) => (days > 0 ? addDays(prev, days) : subDays(prev, Math.abs(days))));
  }, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [selectedDate]);

  // ============================================================================
  // PREPARAÇÃO DE DADOS E GEOMETRIA 2D
  // ============================================================================
  const timeSlots = useMemo(() => {
    return Array.from({ length: END_HOUR - START_HOUR + 1 }).map(
      (_, i) => `${(START_HOUR + i).toString().padStart(2, '0')}:00`
    );
  }, []);

  const processedAppointments = useMemo(() => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const dailyEvents = appointments.filter((apt) => apt.scheduledDate === selectedDateStr);

    return dailyEvents.map((ev) => {
      const startMins = timeToMinutes(ev.startTime);
      const endMins = timeToMinutes(ev.endTime);
      
      const startOffset = startMins - START_HOUR * MINUTES_IN_HOUR;
      const duration = endMins - startMins;
      
      return {
        ...ev,
        geometry: {
          top: (startOffset / MINUTES_IN_HOUR) * HOUR_HEIGHT,
          height: (duration / MINUTES_IN_HOUR) * HOUR_HEIGHT,
        },
      };
    });
  }, [appointments, selectedDate]);

  // ============================================================================
  // SINCRONIZAÇÃO DE SCROLL (L7)
  // ============================================================================
  const handleGridScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 1. BARRA DE CONTROLE DE DATA (Desktop View) */}
      <View style={styles.dateControlBar}>
        <View style={styles.monthSelector}>
          <Pressable style={styles.iconButton} onPress={() => changeDate(-7)}>
            <Ionicons name="chevron-back" size={20} color="#475569" />
          </Pressable>
          <Text style={styles.monthText}>{format(selectedDate, "MMMM yyyy", { locale: ptBR })}</Text>
          <Pressable style={styles.iconButton} onPress={() => changeDate(7)}>
            <Ionicons name="chevron-forward" size={20} color="#475569" />
          </Pressable>
          <Pressable style={styles.todayButton} onPress={() => setSelectedDate(new Date())}>
            <Text style={styles.todayButtonText}>Hoje</Text>
          </Pressable>
        </View>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <Pressable key={idx} style={[styles.desktopDayCol, isSelected && styles.desktopDayColSelected]} onPress={() => setSelectedDate(day)}>
                <Text style={[styles.desktopDayName, isToday && styles.textToday]}>
                  {format(day, 'EEEE', { locale: ptBR })}
                </Text>
                <Text style={[styles.desktopDayNumber, isSelected && styles.textSelectedWhite, isToday && !isSelected && styles.textToday]}>
                  {format(day, 'dd')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. HEADER DE FUNCIONÁRIOS (Sincronizado) */}
      <View style={styles.staffHeaderRow}>
        <View style={styles.emptyCorner}>
          <Text style={styles.timezoneText}>GMT-3</Text>
        </View>
        
        <ScrollView
          ref={headerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false} // Movido pelo grid inferior
          style={styles.flex1}
        >
          {staffList.map((staff) => (
            <View key={staff.id} style={styles.staffHeaderCol}>
              <View style={[styles.avatarPlaceholder, { borderColor: staff.colorHex, borderWidth: 2 }]}>
                {staff.avatarUrl ? (
                  <Image source={{ uri: staff.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarLetter, { color: staff.colorHex }]}>
                    {staff.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.staffMeta}>
                <Text style={styles.staffName} numberOfLines={1}>{staff.name}</Text>
                <Text style={styles.staffRole} numberOfLines={1}>{staff.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 3. GRID 2D (Eixo Y: Horas, Eixo X: Funcionários) */}
      <ScrollView style={styles.flex1} showsVerticalScrollIndicator={true} bounces={false}>
        <View style={styles.timelineWrapper}>
          
          {/* EIXO Y (HORAS) */}
          <View style={styles.timeAxis}>
            {timeSlots.map((time, index) => (
              <View key={index} style={[styles.timeSlot, { height: HOUR_HEIGHT }]}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>

          {/* CANVAS HORIZONTAL */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            onScroll={handleGridScroll}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.flex1}
          >
            <View style={[styles.canvasArea, { width: staffList.length * COLUMN_WIDTH }]}>
              
              {/* Linhas Horizontais de Fundo */}
              <View style={StyleSheet.absoluteFill}>
                {timeSlots.map((_, index) => (
                  <View key={`line-${index}`} style={[styles.gridLine, { top: index * HOUR_HEIGHT }]} />
                ))}
              </View>

              {/* Colunas (Lanes) */}
              {staffList.map((staff, staffIdx) => {
                const staffEvents = processedAppointments.filter(e => e.employee.id === staff.id);

                return (
                  <View key={staff.id} style={[styles.staffLane, { left: staffIdx * COLUMN_WIDTH }]}>
                    {staffEvents.map((apt) => {
                      const isCanceled = apt.status === 'CANCELED' || apt.status === 'NO_SHOW';
                      const isCompleted = apt.status === 'COMPLETED';

                      return (
                        <View
                          key={apt.id}
                          style={[
                            styles.eventBlock,
                            {
                              top: apt.geometry.top,
                              height: apt.geometry.height,
                              backgroundColor: `${staff.colorHex}1A`,
                              borderLeftColor: staff.colorHex,
                              opacity: isCanceled || isCompleted ? 0.6 : 1,
                            },
                          ]}
                        >
                          <View style={styles.eventInner}>
                            <Text style={[styles.eventTime, { color: staff.colorHex }, isCanceled && styles.textStrike]}>
                              {apt.startTime} - {apt.endTime}
                            </Text>
                            <Text style={[styles.eventClient, isCanceled && styles.textStrike]} numberOfLines={1}>
                              {apt.client.name}
                            </Text>
                            <Text style={[styles.eventService, isCanceled && styles.textStrike]} numberOfLines={1}>
                              {apt.service.name}
                            </Text>
                            
                            {/* Notas adicionais visíveis apenas no Desktop por ter mais espaço */}
                            {apt.notes && !isCanceled && (
                              <Text style={styles.eventNotes} numberOfLines={2}>{apt.notes}</Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// STYLESHEET (Valores Absolutos para Web)
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex1: { flex: 1 },
  
  // Controle de Data
  dateControlBar: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  monthText: { fontSize: td(18), fontWeight: '700', color: '#0F172A', textTransform: 'capitalize', width: 160, textAlign: 'center' },
  iconButton: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 8, marginHorizontal: 8 },
  todayButton: { marginLeft: 'auto', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F1F5F9', borderRadius: 6 },
  todayButtonText: { fontSize: td(13), fontWeight: '600', color: '#334155' },
  
  weekDaysRow: { flexDirection: 'row', gap: 8 },
  desktopDayCol: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  desktopDayColSelected: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  desktopDayName: { fontSize: td(12), fontWeight: '600', color: '#64748B', textTransform: 'capitalize', marginBottom: 4 },
  desktopDayNumber: { fontSize: td(18), fontWeight: '700', color: '#1E293B' },
  
  textSelectedWhite: { color: '#FFFFFF' },
  textToday: { color: '#2563EB' },

  // Header de Funcionários
  staffHeaderRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  emptyCorner: { width: TIME_COLUMN_WIDTH, borderRightWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  timezoneText: { fontSize: td(10), color: '#94A3B8', fontWeight: '500' },
  
  staffHeaderCol: { width: COLUMN_WIDTH, flexDirection: 'row', alignItems: 'center', padding: 12, borderRightWidth: 1, borderColor: '#E2E8F0' },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginRight: 12 },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarLetter: { fontSize: td(16), fontWeight: '700' },
  staffMeta: { flex: 1 },
  staffName: { fontSize: td(14), fontWeight: '700', color: '#0F172A' },
  staffRole: { fontSize: td(12), color: '#64748B', marginTop: 2 },

  // Grade
  timelineWrapper: { flexDirection: 'row' },
  timeAxis: { width: TIME_COLUMN_WIDTH, alignItems: 'center', borderRightWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  timeSlot: { justifyContent: 'flex-start' },
  timeText: { fontSize: td(12), color: '#94A3B8', fontWeight: '500', transform: [{ translateY: -10 }] },
  
  canvasArea: { flex: 1, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#F1F5F9' },
  
  staffLane: { position: 'absolute', top: 0, bottom: 0, width: COLUMN_WIDTH, borderRightWidth: 1, borderColor: '#F1F5F9' },
  
  eventBlock: { position: 'absolute', left: 4, right: 4, borderLeftWidth: 4, borderRadius: 6, padding: 0, overflow: 'hidden' },
  eventInner: { flex: 1, padding: 8, borderWidth: 1, borderColor: 'transparent' },
  eventTime: { fontSize: td(11), fontWeight: '700', marginBottom: 2 },
  eventClient: { fontSize: td(14), fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  eventService: { fontSize: td(12), color: '#475569' },
  eventNotes: { fontSize: td(11), color: '#64748B', marginTop: 4, fontStyle: 'italic' },
  textStrike: { textDecorationLine: 'line-through', color: '#94A3B8' },
});