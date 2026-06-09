import { StyleSheet } from 'react-native';
import { HOUR_HEIGHT, MINUTE_HEIGHT } from '../../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../../utils/workTimeEngine';
import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';

// Executa a leitura dinâmica dos limites baseada no seu COMPANY_MOCK
const { startHour, endHour } = getGlobalWorkBounds();
export const TOP_PADDING_MINUTES = 30

const TOTAL_GRID_HEIGHT = (
    ((endHour - startHour) * 60)
    + TOP_PADDING_MINUTES ) * MINUTE_HEIGHT;

export const calendarBaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexDirection: 'row',
    },
    timeAxisContainer: {
        width: l(60),
        backgroundColor: Colors.white,
        zIndex: 2,
        height: TOTAL_GRID_HEIGHT, // Aplicação dinâmica
    },
    timeSlotText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: td(12),
        color: Colors.corTextLight,
        fontFamily:fonts.robotoMedium,
        transform: [{ translateY: -td(6) }],
    },
    gridContainer: {
        flex: 1,
        position: 'relative',
        height: TOTAL_GRID_HEIGHT , // Aplicação dinâmica impede o efeito elástico
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