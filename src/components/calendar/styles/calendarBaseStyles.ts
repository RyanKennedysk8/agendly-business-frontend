import { StyleSheet } from 'react-native';
import { HOUR_HEIGHT, MINUTE_HEIGHT } from '../../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../../utils/workTimeEngine';
import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { AXIS_WIDTH } from '../StaffDailyView';

const { startHour, endHour } = getGlobalWorkBounds();
export const TOP_PADDING_MINUTES = 0;

const TOTAL_GRID_HEIGHT = (((endHour - startHour) * 60) ) * MINUTE_HEIGHT;


export const calendarBaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContent: {
        flexDirection: 'row',
    },
    timeAxisContainer: {
        width: AXIS_WIDTH,
        backgroundColor: Colors.white,
        zIndex: 2,
        height: TOTAL_GRID_HEIGHT,
    },
    timeSlotHour: {
        position: 'absolute',
        width: '100%',
        textAlign: 'right',
        paddingRight:l(5),
        fontSize: td(8), 
        color: Colors.corTextSearch,
        fontFamily: fonts.robotoMedium,
    },
    timeSlotMinute: {
        position: 'absolute',
        width: '100%',
        textAlign: 'right',
        fontSize: td(8), 
        paddingRight:l(5),
        color: Colors.corTextSearch,
        fontFamily: fonts.robotoMedium,
    },

    // -------------------TIME GRID----------------------

    gridContainer: {
        flex: 1,
        position: 'relative',
        height: TOTAL_GRID_HEIGHT, 
    },
    absoluteGridLines: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    gridLineHour: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.gray
    },
    gridLineHalfHour: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: Colors.gray,
        borderStyle: 'dashed',
    },
    columnsWrapper: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: 3,
    },
    dayColumn: {
        flex: 1,
        height: '100%',
        position: 'relative',
        borderRightWidth: 1,
        borderRightColor: Colors.gray,
    }
});