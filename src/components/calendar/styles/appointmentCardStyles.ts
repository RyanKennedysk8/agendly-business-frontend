import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { StyleSheet } from 'react-native';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';

export const appointmentCardStyles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        borderRadius: td(2),
        overflow: 'hidden',
        borderLeftWidth: l(3), 
    },
    verticalRotationWrapper: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', 
    },
    verticalTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
            { rotate: '-90deg' }
        ],
    },
    verticalServiceName: {
        fontSize: td(10),
        fontFamily: fonts.robotoRegular,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    clientName: {
        fontSize: td(12),
        fontFamily: fonts.robotoBold,
        color: Colors.white,
        marginBottom: a(2),
    },
    clientNameSmall: {
        fontSize: td(10),
        fontFamily: fonts.robotoMedium,
        color: '#FFFFFF',
    },
    serviceDetails: {
        fontSize: td(10),
        color: 'rgba(255, 255, 255, 0.9)',
    },
    timeText: {
        fontSize: td(9),
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: a(2),
    }
});