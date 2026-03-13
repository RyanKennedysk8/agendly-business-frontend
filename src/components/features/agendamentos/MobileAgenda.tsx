import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { startOfWeek, addDays, subDays, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AppointmentResponseDTO, EmployeeSummaryDTO } from '@type/appointments';
import { l, a, td } from '@/constants/responsive';

interface MobileAgendaProps {
  appointments: AppointmentResponseDTO[];
  staffList: EmployeeSummaryDTO[];
}

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = a(70);
const MINUTES_IN_HOUR = 60;
const TIME_COLUMN_WIDTH = l(50);
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = (SCREEN_WIDTH - TIME_COLUMN_WIDTH) / 2; 

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * MINUTES_IN_HOUR + m;
};

export const MobileAgenda: React.FC<MobileAgendaProps> = ({ appointments, staffList }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const headerScrollRef = useRef<ScrollView>(null);

  const changeDate = useCallback((days: number) => {
    setSelectedDate((prev) => (days > 0 ? addDays(prev, days) : subDays(prev, Math.abs(days))));
  }, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [selectedDate]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX < -50) runOnJS(changeDate)(1);
      if (e.translationX > 50) runOnJS(changeDate)(-1);
    });

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

  const handleGridScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. HEADER DE DATAS (SWIPE) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.weekHeaderContainer}>
          <View style={styles.monthLabelRow}>
            <Text style={styles.monthText}>{format(selectedDate, "MMMM yyyy", { locale: ptBR })}</Text>
          </View>
          <View style={styles.daysRow}>
            {weekDays.map((day, idx) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <Pressable key={idx} style={styles.dayCol} onPress={() => setSelectedDate(day)}>
                  <Text style={[styles.dayName, isSelected && styles.textSelected, isToday && !isSelected && styles.textToday]}>
                    {format(day, 'E', { locale: ptBR }).toUpperCase().substring(0, 3)}
                  </Text>
                  <View style={[styles.dayNumberBox, isSelected && styles.boxSelected]}>
                    <Text style={[styles.dayNumber, isSelected && styles.textSelectedWhite, isToday && !isSelected && styles.textToday]}>
                      {format(day, 'd')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.flex1}>
        {/* 2. HEADER DE FUNCIONÁRIOS (Sincronizado via L7) */}
        <View style={styles.staffHeaderRow}>
          <View style={styles.emptyCorner} />
          
          <ScrollView
            ref={headerScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
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
                <Text style={styles.staffName} numberOfLines={1}>{staff.name}</Text>
                <Text style={styles.staffRole} numberOfLines={1}>{staff.role}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 3. GRID 2D */}
        <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding} bounces={false}>
          <View style={styles.timelineWrapper}>
            
            <View style={styles.timeAxis}>
              {timeSlots.map((time, index) => (
                <View key={index} style={[styles.timeSlot, { height: HOUR_HEIGHT }]}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={handleGridScroll} scrollEventThrottle={16} bounces={false} style={styles.flex1}>
              <View style={[styles.canvasArea, { width: staffList.length * COLUMN_WIDTH }]}>
                
                <View style={StyleSheet.absoluteFill}>
                  {timeSlots.map((_, index) => (
                    <View key={`line-${index}`} style={[styles.gridLine, { top: index * HOUR_HEIGHT }]} />
                  ))}
                </View>

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
                                opacity: isCanceled || isCompleted ? 0.6 : 1, // Feedback visual de status
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
    </View>
  );
};

// ============================================================================
// STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex1: { flex: 1 },
  scrollPadding: { paddingBottom: a(100) },
  
  weekHeaderContainer: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0', paddingBottom: a(10), paddingTop: a(10) },
  monthLabelRow: { paddingHorizontal: l(16), marginBottom: a(12) },
  monthText: { fontSize: td(16), fontWeight: '700', color: '#0F172A', textTransform: 'capitalize' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: l(8) },
  dayCol: { alignItems: 'center', flex: 1 },
  dayName: { fontSize: td(11), fontWeight: '600', color: '#64748B', marginBottom: a(4) },
  dayNumberBox: { width: td(32), height: td(32), borderRadius: td(16), justifyContent: 'center', alignItems: 'center' },
  dayNumber: { fontSize: td(15), fontWeight: '700', color: '#1E293B' },
  boxSelected: { backgroundColor: '#0F172A' },
  textSelected: { color: '#0F172A' },
  textSelectedWhite: { color: '#FFFFFF' },
  textToday: { color: '#2563EB' },

  staffHeaderRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  emptyCorner: { width: TIME_COLUMN_WIDTH, borderRightWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  staffHeaderCol: { width: COLUMN_WIDTH, alignItems: 'center', paddingVertical: a(12), borderRightWidth: 1, borderColor: '#E2E8F0' },
  avatarPlaceholder: { width: td(40), height: td(40), borderRadius: td(20), backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: a(6), overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarLetter: { fontSize: td(16), fontWeight: '700' },
  staffName: { fontSize: td(13), fontWeight: '700', color: '#0F172A' },
  staffRole: { fontSize: td(11), color: '#64748B', marginTop: a(2) },

  timelineWrapper: { flexDirection: 'row' },
  timeAxis: { width: TIME_COLUMN_WIDTH, alignItems: 'center', borderRightWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  timeSlot: { justifyContent: 'flex-start' },
  timeText: { fontSize: td(12), color: '#94A3B8', fontWeight: '500', transform: [{ translateY: -td(8) }] },
  
  canvasArea: { flex: 1, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#F1F5F9' },
  
  staffLane: { position: 'absolute', top: 0, bottom: 0, width: COLUMN_WIDTH, borderRightWidth: 1, borderColor: '#F1F5F9' },
  
  eventBlock: { position: 'absolute', left: l(4), right: l(4), borderLeftWidth: l(4), borderRadius: td(6), padding: 0, overflow: 'hidden' },
  eventInner: { flex: 1, paddingHorizontal: l(6), paddingVertical: a(4), borderWidth: 1, borderColor: 'transparent' },
  eventTime: { fontSize: td(10), fontWeight: '700', marginBottom: a(1) },
  eventClient: { fontSize: td(13), fontWeight: '700', color: '#0F172A', marginBottom: a(1) },
  eventService: { fontSize: td(11), color: '#475569' },
  textStrike: { textDecorationLine: 'line-through', color: '#94A3B8' },
});