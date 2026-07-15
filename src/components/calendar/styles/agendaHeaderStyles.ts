import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { StyleSheet } from 'react-native';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { CalendarColors } from './constants/calendarColors';

export const agendaHeaderStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        zIndex: 10,
      
    },
    topRow: {
        alignItems: 'center',
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal: l(10),
        paddingVertical:a(10),
        backgroundColor:Colors.black
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"center",
        gap:l(2)
    },
    monthText: {
        fontSize: td(18),
        fontFamily:fonts.robotoBold,
        color: Colors.white,
        textTransform: 'capitalize'
    },
    yearText: {
        fontSize: td(10),
        fontFamily:fonts.robotoBold,
        color: Colors.white,
        textTransform: 'capitalize'
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.corContainer,
        borderRadius: td(8),
        padding: l(2),
    },
    tabButton: {
        paddingVertical: a(6),
        paddingHorizontal: l(15),
        borderRadius: td(6)
    },
    tabButtonActive: {
        backgroundColor: Colors.black,
    },
    tabText: {
        fontSize: td(12),
        fontFamily:fonts.robotoMedium,
        color: Colors.corText,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    columnsRow: {
        flexDirection: 'row',
        paddingLeft: l(60), // O mesmo width do TimeAxis para alinhar perfeitamente a grade
        height: a(40),
    },
    columnHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#F3F4F6',
    },
    columnDayName: {
        fontSize: td(10),
        color: Colors.corTextLight,
        fontFamily:fonts.robotoMedium,
        textTransform: 'uppercase',
    },
    columnDayNumber: {
        fontSize: td(14),
        fontFamily:fonts.robotoMedium,
        color: Colors.corTextLight,
    },
    daysAxisContainer: {
        flexDirection: 'row',
        paddingHorizontal:l(5),
        paddingBottom:a(5)
    },
    timeAxisSpacer: {
        width: l(60),
        justifyContent:"center",
        alignItems:"center",
        
    },
    columnsWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    dayColumnHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: a(2),
        marginHorizontal: l(2),
        marginVertical: a(5),
        borderRadius: td(10)
    },
    dayOfWeekText: {
        fontSize: td(10),
        fontFamily:fonts.robotoMedium,
        color: CalendarColors.hourText,

    },
    dateCircle: {
        width: td(30),
        height: td(30),
        borderRadius: td(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateCircleActive: {
        backgroundColor: Colors.corScreen,
    },
    dayOfMonthText: {
        fontSize: td(14),
        fontFamily:fonts.robotoMedium,
        color: Colors.corText,
    },
    todayText: {
        color: Colors.corButton,
    },
    todayTextCircle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    activeTextCircle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    dateRangeWrapper: {
        width: '100%',
        height: l(28),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop:a(10)
    },
    todayActiveCircle: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    
});