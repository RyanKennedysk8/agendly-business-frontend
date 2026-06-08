import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { StyleSheet } from 'react-native';

export const monthViewStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    calendarSection: {
        paddingHorizontal: l(8),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: Colors.corButton,
        borderBottomRightRadius:td(15),
        borderBottomLeftRadius:td(15)
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginTop: a(5),
    },
    weekDayLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: td(10),
        fontFamily:fonts.robotoRegular,
        color: Colors.white,
    },
    gridWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Força a quebra automática a cada 7 itens
    },
    cellContainer: {
        height: td(40),
        width: '14.2857%', // Garante exatamente 7 colunas por linha
        aspectRatio: 1.1, // Células levemente retangulares para ergonomia tátil
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cellDayText: {
        fontSize: td(15),
        fontFamily:fonts.robotoMedium,
        color: Colors.white,
    },
    cellDayOutside: {
        fontFamily:fonts.robotoRegular,
        color: Colors.corButtonOff, // Apaga visualmente os dias dos meses adjacentes
    },
    cellSelected: {
        backgroundColor: Colors.white, // Sua cor primária de destaque de seleção
        borderRadius: td(20),
        width: td(40), 
        height: td(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSelected: {
        color: Colors.corButton,
        fontFamily:fonts.robotoBold,
    },
    // Badge indicador de volume de agendamento
    badgeDot: {
        position: 'absolute',
        bottom: a(1),
        backgroundColor: Colors.corText,
        borderRadius: td(10),
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
        backgroundColor: Colors.white,
        minHeight: a(200),
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