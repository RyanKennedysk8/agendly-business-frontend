import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { generateTimeSlots, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { calendarBaseStyles } from './styles/calendarBaseStyles';
import { getGlobalWorkBounds } from '@/utils/workTimeEngine';

// memo() garante que a régua nunca seja re-renderizada quando os agendamentos mudarem
export const TimeAxis = memo(() => {
    const { startHour, endHour } = getGlobalWorkBounds();
    const slots = generateTimeSlots(30, startHour, endHour);

    return (
        <View style={calendarBaseStyles.timeAxisContainer}>
            {slots.map((time, index) => {
                const topPosition = (index * 30) * MINUTE_HEIGHT; // Agora relativo ao início do grid
                return (
                    <Text key={`axis-${index}`} style={[calendarBaseStyles.timeSlotText, { top: topPosition }]}>
                        {time}
                    </Text>
                );
            })}
        </View>
    );
});