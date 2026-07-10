import React, { memo } from 'react';
import { View } from 'react-native';
import { generateTimeSlots, MINUTE_HEIGHT } from '../../utils/calendarMetrics';
import { calendarBaseStyles, TOP_PADDING_MINUTES } from './styles/calendarBaseStyles';
import { getGlobalWorkBounds, isSlotClosed } from '@/utils/workTimeEngine';
import { OperatingHourDTO } from '@/types/company';

export const TimeGrid = memo(
    ({
        date,
        operatingHours,
    }: {
        date: Date;
        operatingHours: OperatingHourDTO[];
    }) => {
        const { startHour, endHour } = getGlobalWorkBounds(operatingHours);
        const slots = generateTimeSlots(15, startHour, endHour);

        return (
            <View style={calendarBaseStyles.absoluteGridLines}>
                {slots.map((time, index) => {
                    const isClosed = isSlotClosed(
                        date,
                        time,
                        operatingHours
                    );

                    const previousClosed =
                        index > 0 &&
                        isSlotClosed(
                            date,
                            slots[index - 1],
                            operatingHours
                        );

                    const nextClosed =
                        index < slots.length - 1 &&
                        isSlotClosed(
                            date,
                            slots[index + 1],
                            operatingHours
                        );

                    const top =
                        ((index * 15) + TOP_PADDING_MINUTES) *
                        MINUTE_HEIGHT;

                    return (
                        <View
                            key={`grid-${index}`}
                            style={{
                                position: 'absolute',
                                top,
                                left: 0,
                                right: 0,
                            }}
                        >
                            {isClosed ? (
                                <View
                                    style={{
                                        height: 15 * MINUTE_HEIGHT,
                                        width: '100%',

                                        // Fundo inspirado no Apple Calendar
                                        backgroundColor: '#F6F6F7',

                                        // Une os blocos consecutivos
                                        borderTopWidth: previousClosed ? 0 : 0.5,
                                        borderBottomWidth: nextClosed ? 0 : 0.5,

                                        borderTopColor: '#E9E9EB',
                                        borderBottomColor: '#E9E9EB',
                                    }}
                                />
                            ) : (
                                <View
                                    style={
                                        time.endsWith(':00')
                                            ? calendarBaseStyles.gridLineHour
                                            : calendarBaseStyles.gridLineHalfHour
                                    }
                                />
                            )}
                        </View>
                    );
                })}
            </View>
        );
    }
);