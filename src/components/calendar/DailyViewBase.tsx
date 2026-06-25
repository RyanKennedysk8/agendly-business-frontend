import React, { useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { TimeAxis } from './TimeAxis';
import { TimeGrid } from './TimeGrid';
import { AppointmentCard } from './AppointmentCard';
import { MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../utils/workTimeEngine';
import { AppointmentDetail } from '@/types/appointments';
import { processDayAppointments } from '../../utils/overLapEngine';
import { calendarBaseStyles, TOP_PADDING_MINUTES } from './styles/calendarBaseStyles';
import { OperatingHourDTO } from '@/types/company';

interface DailyViewBaseProps {
    visibleDays: Date[];
    appointments: AppointmentDetail[];
    operatingHours: OperatingHourDTO[];
    isRefetching: boolean;
    onRefresh: () => void;
}

export const DailyViewBase = ({ 
    visibleDays = [], 
    appointments = [], 
    operatingHours = [],
    isRefetching, 
    onRefresh 
}: DailyViewBaseProps) => {
    const scrollRef = useRef<ScrollView>(null);

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
        
        const { startHour } = getGlobalWorkBounds(operatingHours);
        const startOffsetMinutes = startHour * 60;

        return visibleDays.map(day => {
            if (!(day instanceof Date) || isNaN(day.getTime())) {
                return { date: new Date(), dateKey: 'invalid', appointments: [] };
            }

            const dateStr = day.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(appt => 
                appt.startTime && appt.startTime.startsWith(dateStr)
            );

            const processed = processDayAppointments(dayAppointments);

            const aligned = processed.map(appt => ({
                ...appt,
                layout: {
                    ...appt.layout,
                    top: appt.layout.top -
                        (startOffsetMinutes * MINUTE_HEIGHT) +
                        (TOP_PADDING_MINUTES * MINUTE_HEIGHT)
                }
            }));

            return {
                date: day,
                dateKey: dateStr,
                appointments: aligned
            };
        });
    }, [visibleDays, appointments, operatingHours]);

    return (
        <View style={calendarBaseStyles.gridContainer}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[calendarBaseStyles.scrollContent]}
                overScrollMode="always"
                bounces={true} 
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching} 
                        onRefresh={onRefresh} 
                        tintColor="#FF7A00" 
                        colors={["#FF7A00"]} 
                    />
                }
            >
                <TimeAxis operatingHours={operatingHours}/>
                <View style={calendarBaseStyles.gridContainer}>
                    <View style={calendarBaseStyles.columnsWrapper}>
                        {columnsData.map((column) => (
                            <View key={column.dateKey} style={calendarBaseStyles.dayColumn}>
                                <TimeGrid date={column.date} operatingHours={operatingHours}/>
                                
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