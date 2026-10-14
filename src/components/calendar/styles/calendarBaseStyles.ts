import { fonts } from '@/assets/fonts/fonts';
import { AXIS_WIDTH } from '@/components/calendar/styles/constants/calendarLayout';
import { CalendarColors } from '@/components/calendar/styles/constants/calendarColors';
import { l, td } from '@/constants/responsive';
import { StyleSheet } from 'react-native';
import { MINUTE_HEIGHT } from '../../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../../utils/workTimeEngine';

const { startHour, endHour } = getGlobalWorkBounds();
export const TOP_PADDING_MINUTES = 0;

const TOTAL_GRID_HEIGHT =
    ((endHour - startHour) * 60) * MINUTE_HEIGHT;

export const calendarBaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CalendarColors.background,
    },

    scrollContent: {
        flexDirection: 'row',
    },

    timeAxisContainer: {
        width: AXIS_WIDTH,
        backgroundColor: CalendarColors.background,
        zIndex: 2,
        height: TOTAL_GRID_HEIGHT,
    },

    timeLabelContainer: {
        position: 'absolute',
        width: '100%',
        height: 12,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: l(5),
    },

    timeSlotHour: {
        fontSize: td(8),
        lineHeight: 12,
        color: CalendarColors.hourText,
        fontFamily: fonts.robotoMedium,
        textAlign: 'right',
    },

    timeSlotMinute: {
        fontSize: td(8),
        lineHeight: 12,
        color: CalendarColors.minuteText,
        fontFamily: fonts.robotoMedium,
        textAlign: 'right',
    },

    // ------------------- TIME GRID ----------------------

    gridContainer: {
        flex: 1,
        position: 'relative',
        height: TOTAL_GRID_HEIGHT,
        
    },

    absoluteGridLines: {
        ...StyleSheet.absoluteFill,
        zIndex: 1,
        
    },

    gridLineHour: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: CalendarColors.hourLine,
        
    },

    gridLineHalfHour: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: CalendarColors.halfHourLine,
    },

    columnsWrapper: {
        ...StyleSheet.absoluteFill,
        flexDirection: 'row',
        zIndex: 3,
    },

    dayColumn: {
        flex: 1,
        height: '100%',
        position: 'relative',
        borderRightWidth: 1,
        borderRightColor: CalendarColors.dayDivider,
    },
});