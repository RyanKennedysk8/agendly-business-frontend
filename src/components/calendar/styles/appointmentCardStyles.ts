import { fonts } from '@/assets/fonts/fonts';
import { StyleSheet } from 'react-native';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';

export const appointmentCardStyles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        borderRadius: td(2),
        padding: td(2),
        overflow: 'hidden', // Fundamental para agendamentos curtos (ex: 15 min)
    },
    clientName: {
        fontSize: td(12),
        fontFamily:fonts.robotoBlack,
        color: '#FFFFFF',
        marginBottom: a(2),
    },
    serviceDetails: {
        fontSize: td(10),
        color: 'rgba(255, 255, 255, 0.9)', // Branco com leve transparência
    },
    timeText: {
        fontSize: td(9),
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: a(2),
    }
});