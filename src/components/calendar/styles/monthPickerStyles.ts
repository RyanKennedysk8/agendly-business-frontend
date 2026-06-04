import { a, l, td } from '@/constants/responsive';
import { StyleSheet } from 'react-native';

export const monthPickerStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Blur/escurecimento suave do fundo
        justifyContent: 'center',
        alignItems: 'center',
        padding: l(20),
    },
    modalContent: {
        width: '100%',
        maxWidth: l(320),
        backgroundColor: '#FFFFFF',
        borderRadius: td(16),
        padding: l(20),
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    yearHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: a(20),
    },
    yearText: {
        fontSize: td(18),
        fontWeight: 'bold',
        color: '#111827',
    },
    navButton: {
        padding: l(8),
    },
    navButtonText: {
        fontSize: td(18),
        fontWeight: 'bold',
        color: '#FF7A00', // Sua cor primária nos controles
    },
    monthsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    monthCell: {
        width: '30%', // Grade de 3 colunas
        aspectRatio: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: a(6),
        borderRadius: td(8),
        backgroundColor: '#F9FAFB',
    },
    monthCellActive: {
        backgroundColor: '#FF7A00', // Destaque do mês selecionado
    },
    monthText: {
        fontSize: td(13),
        fontWeight: '600',
        color: '#4B5563',
        textTransform: 'capitalize',
    },
    monthTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    }
});