import React, { memo } from 'react';
import { View } from 'react-native';
import { generateTimeSlots, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { calendarBaseStyles, TOP_PADDING_MINUTES } from './styles/calendarBaseStyles';
import { getGlobalWorkBounds, isSlotClosed } from '@/utils/workTimeEngine';
import { Colors } from '@/colors/color';
import { OperatingHourDTO } from '@/types/company';

export const TimeGrid = memo(({ date, operatingHours }: { date: Date, operatingHours: OperatingHourDTO[] }) => {
    // Injetamos os horários reais aqui
    const { startHour, endHour } = getGlobalWorkBounds(operatingHours);
    const slots = generateTimeSlots(15, startHour, endHour);

    return (
        <View style={calendarBaseStyles.absoluteGridLines}>
            {slots.map((time, index) => {
                // Verificamos com a base real se o slot está fechado/almoço
                const isClosed = isSlotClosed(date, time, operatingHours);
                const top = ((index * 15) + TOP_PADDING_MINUTES) * MINUTE_HEIGHT;

                return (
                    <View key={`grid-${index}`} style={{ position: 'absolute', top, left: 0, right: 0 }}>
                        {isClosed && (
                            <View style={{
                                height: 15 * MINUTE_HEIGHT,
                                backgroundColor: Colors.gray,
                                marginVertical:0.2,
                                width: '100%'
                            }} />
                        )}
                        <View style={time.endsWith(':00') ? calendarBaseStyles.gridLineHour : calendarBaseStyles.gridLineHalfHour} />
                    </View>
                );
            })}
        </View>
    );
});