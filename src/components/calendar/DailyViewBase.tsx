// src/components/calendar/DailyViewBase.tsx
import React, { useRef, useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { TimeAxis } from './TimeAxis';
import { TimeGrid } from './TimeGrid';
import { AppointmentCard } from './AppointmentCard';
import { MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../utils/workTimeEngine';
import { AppointmentDetail } from '@/types/appointments';
import { processDayAppointments } from '@/utils/overLapEngine';
import { calendarBaseStyles } from './styles/calendarBaseStyles';
import { a } from '@/constants/responsive';

interface DailyViewBaseProps {
    visibleDays: Date[];
    appointments: AppointmentDetail[];
}

export const DailyViewBase = ({ visibleDays = [], appointments = [] }: DailyViewBaseProps) => {
    const scrollRef = useRef<ScrollView>(null);

    // Efeito de scroll automático para o início do expediente
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: false });
            }
        }, 16);
        return () => clearTimeout(timer);
    }, [visibleDays]);

    const columnsData = useMemo(() => {
        if (!visibleDays || visibleDays.length === 0) return [];
        
        const { startHour } = getGlobalWorkBounds();
        const startOffsetMinutes = startHour * 60;

        return visibleDays.map(day => {
            if (!(day instanceof Date) || isNaN(day.getTime())) {
                return { date: new Date(), dateKey: 'invalid', appointments: [] };
            }

            const dateStr = day.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(appt => 
                appt.startTime && appt.startTime.startsWith(dateStr)
            );

            // 1. Processa a cascata matemática
            const processed = processDayAppointments(dayAppointments);

            // 2. Alinha os agendamentos ao grid reduzido (Offset Y)
            const aligned = processed.map(appt => ({
                ...appt,
                layout: {
                    ...appt.layout,
                    top: appt.layout.top - (startOffsetMinutes * MINUTE_HEIGHT)
                }
            }));

            return {
                date: day,
                dateKey: dateStr,
                appointments: aligned
            };
        });
    }, [visibleDays, appointments]);

    return (
        <View style={calendarBaseStyles.gridContainer}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    calendarBaseStyles.scrollContent
                ]}
            >
                <TimeAxis />
                <View style={calendarBaseStyles.gridContainer}>
                    <View style={calendarBaseStyles.columnsWrapper}>
                        {columnsData.map((column) => (
                            <View key={column.dateKey} style={calendarBaseStyles.dayColumn}>
                                <TimeGrid date={column.date} />
                                
                                {/* Renderiza os agendamentos por cima */}
                                {column.appointments.map((appt) => (
                                    <AppointmentCard 
                                        key={appt.appointmentId} 
                                        appointment={appt} 
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};