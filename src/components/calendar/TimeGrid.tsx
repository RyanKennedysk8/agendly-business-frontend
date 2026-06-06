import React, { memo } from 'react';
import { View } from 'react-native';
import { generateTimeSlots, HOUR_HEIGHT, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { calendarBaseStyles } from './styles/calendarBaseStyles';
import { getGlobalWorkBounds, isSlotClosed } from '@/utils/workTimeEngine';
import { Colors } from '@/colors/color';

export const TimeGrid = memo(({ date }: { date: Date }) => {
    const { startHour, endHour } = getGlobalWorkBounds();
    const slots = generateTimeSlots(30, startHour, endHour);

    return (
        <View style={calendarBaseStyles.absoluteGridLines}>
            {slots.map((time, index) => {
                const isClosed = isSlotClosed(date, time);
                const top = (index * 30) * MINUTE_HEIGHT;

                return (
                    <View key={`grid-${index}`} style={{ position: 'absolute', top, left: 0, right: 0 }}>
                        {/* Bloco Cinza para horários fechados */}
                        {isClosed && (
                            <View style={{
                                height: 30 * MINUTE_HEIGHT,
                                backgroundColor: Colors.corContainer, // Cinza claro profissional
                                width: '100%'
                            }} />
                        )}
                        
                        {/* Linhas de divisão */}
                        <View style={time.endsWith(':00') ? calendarBaseStyles.gridLineHour : calendarBaseStyles.gridLineHalfHour} />
                    </View>
                );
            })}
        </View>
    );
});