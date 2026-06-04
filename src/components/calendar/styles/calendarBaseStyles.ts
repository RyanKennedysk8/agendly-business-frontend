import { StyleSheet } from 'react-native';
import { HOUR_HEIGHT } from '../../../utils/calendarMetrics';
import { getGlobalWorkBounds } from '../../../utils/workTimeEngine';
import { a, l, td } from '@/constants/responsive';

// Executa a leitura dinâmica dos limites baseada no seu COMPANY_MOCK
const { startHour, endHour } = getGlobalWorkBounds();
const TOTAL_GRID_HEIGHT = (endHour - startHour) * HOUR_HEIGHT;

export const calendarBaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexDirection: 'row',
        paddingBottom: a(100),
    },
    timeAxisContainer: {
        width: l(60),
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
        zIndex: 2,
        height: TOTAL_GRID_HEIGHT, // Aplicação dinâmica
    },
    timeSlotText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: td(11),
        color: '#9CA3AF',
        fontWeight: '500',
        transform: [{ translateY: -td(6) }],
    },
    gridContainer: {
        flex: 1,
        position: 'relative',
        height: TOTAL_GRID_HEIGHT, // Aplicação dinâmica impede o efeito elástico
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
        backgroundColor: '#E5E7EB',
    },
    gridLineHalfHour: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#F3F4F6',
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
        borderRightColor: '#E5E7EB',
    }
});