import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { generateTimeSlots, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { getDailyWorkBounds } from '@/utils/workTimeEngine';
import { calendarBaseStyles } from './styles/calendarBaseStyles';
import { td } from '@/constants/responsive';

interface TimeAxisProps {
    date: Date;
    operatingHours: any[];
}

export const HOUR_LABEL_HEIGHT = td(10);

export const TimeAxis = memo(({ date, operatingHours }: TimeAxisProps) => {
    const { startHour, endHour } = getDailyWorkBounds(operatingHours, date);
    const slots = generateTimeSlots(15, startHour, endHour);

    return (
        <View style={calendarBaseStyles.timeAxisContainer}>
            {slots.map((time, index) => {
                const topPosition = (index * 15) * MINUTE_HEIGHT;

                const isHourLabel = time.endsWith(':00');
                const label = isHourLabel ? time : time.split(':')[1];

                return (
                    <View
                        key={`axis-${index}`}
                        style={[
                            calendarBaseStyles.timeLabelContainer,
                            {
                                top: topPosition - HOUR_LABEL_HEIGHT / 2,
                            },
                        ]}
                    >
                        <Text
                            style={
                                isHourLabel
                                    ? calendarBaseStyles.timeSlotHour
                                    : calendarBaseStyles.timeSlotMinute
                            }
                        >
                            {label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
});

TimeAxis.displayName = 'TimeAxis';