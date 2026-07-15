import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { generateTimeSlots, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { getDailyWorkBounds, isSlotClosed } from '@/utils/workTimeEngine';
import { calendarBaseStyles } from './styles/calendarBaseStyles';
import { a, l } from '@/constants/responsive';
import { CalendarColors } from './styles/constants/calendarColors';

interface TimeGridProps {
    date: Date;
    operatingHours: any[];
}

export const TimeGrid = memo(({ date, operatingHours }: TimeGridProps) => {
    // Agora o Grid vai sincronizar o tamanho dele com o TimeAxis
    const { startHour, endHour } = getDailyWorkBounds(operatingHours, date);
    const slots = generateTimeSlots(15, startHour, endHour);

    return (
        <View style={StyleSheet.absoluteFill }>
            {slots.map((time, index) => {
                const closed = isSlotClosed(date, time, operatingHours);
                const top = (index * 15) * MINUTE_HEIGHT;

                return (
                    <View key={`grid-${index}`} style={{ position: 'absolute', top, left: 0, right: 0, height: 15 * MINUTE_HEIGHT}}>
                        {closed && (
                        <View
                            style={{
                                flex: 1,
                                marginTop: 1,
                        
                                backgroundColor: CalendarColors.background,
                                borderWidth:StyleSheet.absoluteFill,
                                borderColor: CalendarColors.hourLine,
                                overflow: 'hidden',
                            }}
                        >
                            {Array.from({ length: 14 }).map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: 1.5,
                                        height: 70,
                                        backgroundColor: CalendarColors.hourLine,
                                        transform: [{ rotate: '45deg' }],
                                        left: i * 14 - 20,
                                        top: -15,
                                        opacity: 0.55,
                                    }}
                                />
                            ))}
                        </View>
                        )}
                        <View style={[
                            time.endsWith(':00') ? calendarBaseStyles.gridLineHour : calendarBaseStyles.gridLineHalfHour,
                            { position: 'absolute', top: 0, left: 0, right: 0 }
                        ]} />
                    </View>
                );
            })}
        </View>
    );
});