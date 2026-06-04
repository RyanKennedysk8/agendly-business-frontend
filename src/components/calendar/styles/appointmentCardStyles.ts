import { StyleSheet } from 'react-native';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';

export const appointmentCardStyles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        borderRadius: td(6),
        padding: l(6),
        overflow: 'hidden', // Fundamental para agendamentos curtos (ex: 15 min)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        // A borda esquerda mais grossa dá o aspecto profissional de calendário
        borderLeftWidth: l(4), 
    },
    clientName: {
        fontSize: td(12),
        fontWeight: 'bold',
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