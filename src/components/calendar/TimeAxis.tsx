import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { calendarBaseStyles, TOP_PADDING_MINUTES } from './styles/calendarBaseStyles';
import { getGlobalWorkBounds } from '@/utils/workTimeEngine';
import { MINUTE_HEIGHT } from '@/utils/calendarMetrics';
import { OperatingHourDTO } from '@/types/company';

export const TimeAxis = memo(({ operatingHours }: { operatingHours: OperatingHourDTO[] }) => {
    const timeSlots = useMemo(() => {
        // Agora injetamos os horários reais aqui
        const { startHour, endHour } = getGlobalWorkBounds(operatingHours);
        const slots = [];
        
        const startMinutes = startHour * 60;
        const endMinutes = endHour * 60;
        const INTERVAL_STEP = 15;

        for (let minutes = startMinutes; minutes <= endMinutes; minutes += INTERVAL_STEP) {
            const currentHour = Math.floor(minutes / 60);
            const currentMinute = minutes % 60;
            const isHourLabel = currentMinute === 0;

            const label = isHourLabel 
                ? `${String(currentHour).padStart(2, '0')}:00` 
                : String(currentMinute);

            const offsetMinutes = minutes - startMinutes;
            const topPosition = (offsetMinutes + TOP_PADDING_MINUTES) * MINUTE_HEIGHT;

            slots.push({
                key: `${currentHour}-${currentMinute}`,
                label,
                isHourLabel,
                top: topPosition,
            });
        }
        return slots;
    }, [operatingHours]);

    return (
        <View style={calendarBaseStyles.timeAxisContainer}>
            {timeSlots.map((slot) => (
                <Text
                    key={slot.key}
                    style={[
                        slot.isHourLabel ? calendarBaseStyles.timeSlotHour : calendarBaseStyles.timeSlotMinute,
                        { top: slot.top }
                    ]}
                >
                    {slot.label}
                </Text>
            ))}
        </View>
    );
});
TimeAxis.displayName = 'TimeAxis';