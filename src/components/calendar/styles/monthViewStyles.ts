import { a, l, td } from '@/constants/responsive';
import { StyleSheet } from 'react-native';

export const monthViewStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Região do Calendário (Metade Superior)
    calendarSection: {
        paddingHorizontal: l(8),
        paddingBottom: a(12),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FAFAFA',
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: a(6),
    },
    weekDayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: td(11),
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    gridWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Força a quebra automática a cada 7 itens
    },
    cellContainer: {
        width: '14.2857%', // Garante exatamente 7 colunas por linha
        aspectRatio: 1.1, // Células levemente retangulares para ergonomia tátil
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: a(2),
    },
    cellDayText: {
        fontSize: td(14),
        fontWeight: '500',
        color: '#111827',
    },
    cellDayOutside: {
        color: '#D1D5DB', // Apaga visualmente os dias dos meses adjacentes
    },
    cellSelected: {
        backgroundColor: '#FF7A00', // Sua cor primária de destaque de seleção
        borderRadius: td(20),
        width: l(28),
        height: l(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    // Badge indicador de volume de agendamento
    badgeDot: {
        position: 'absolute',
        bottom: a(2),
        backgroundColor: '#3B82F6', // Azul discreto para balancear com o laranja de seleção
        borderRadius: td(6),
        minWidth: l(14),
        height: a(12),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: l(2),
    },
    badgeText: {
        fontSize: td(8),
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    // Região da Lista Otimizada (Metade Inferior)
    listSection: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: a(40),
    },
    listEmptyText: {
        fontSize: td(14),
        color: '#9CA3AF',
        fontWeight: '500',
    },
    appointmentItem: {
        flexDirection: 'row',
        padding: l(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
    },
    timeIndicator: {
        width: l(50),
        fontSize: td(13),
        fontWeight: '600',
        color: '#4B5563',
    },
    cardContent: {
        flex: 1,
        marginLeft: l(12),
        paddingLeft: l(10),
        borderLeftWidth: l(3),
    },
    serviceTitle: {
        fontSize: td(14),
        fontWeight: 'bold',
        color: '#111827',
    },
    staffName: {
        fontSize: td(12),
        color: '#6B7280',
        marginTop: a(2),
    }
});