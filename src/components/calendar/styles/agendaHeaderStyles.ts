import { StyleSheet, Dimensions } from 'react-native';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { CalendarColors } from './constants/calendarColors';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export const agendaHeaderStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        zIndex: 50, 
    },
    
    // OVERLAY: Camada preta transparente
    overlay: {
        position: 'absolute',
        top: 0, 
        left: 0,
        right: 0,
        zIndex: 40, 
    },

    // WRAPPER ABSOLUTO: Cobre a âncora Ghost
    absoluteDrawerWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 50,
    },
    
    // SOMBRA DA GAVETA (Ativada apenas ao abrir)
    drawerShadow: {
        borderBottomLeftRadius: td(12),
        borderBottomRightRadius: td(12),
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },

    topRow: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
        height:a(40),
        paddingHorizontal: l(10),
        marginBottom:a(10)
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor:Colors.white,
        borderColor:Colors.gray,
        borderWidth:1,
        borderRadius:td(5),
        minWidth:l(150),
        maxWidth:l(200),
        paddingVertical:a(5),
        paddingHorizontal:l(10),
        gap: l(2)
    },
    monthText: {
        fontSize: td(14),
        fontFamily: fonts.robotoRegular,
        color: Colors.corText,
        textTransform: 'capitalize'
    },
    yearText: {
        fontSize: td(10),
        fontFamily: fonts.robotoRegular,
        color: Colors.corTextSecondary,
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
        backgroundColor: Colors.corScreen,
    },
    tabText: {
        fontSize: td(12),
        fontFamily: fonts.robotoMedium,
        color: Colors.corText,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },

    weekDaysHeader: {
        flexDirection: 'row',
        paddingHorizontal: l(5),
        backgroundColor: '#FFFFFF',
    },
    weekDayLabelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayOfWeekText: {
        fontSize: td(12),
        fontFamily: fonts.robotoRegular,
        color: Colors.corTextSecondary,
    },
    daysGridContainer: {
        width: '100%',
        overflow: 'hidden', 
        backgroundColor: '#FFFFFF',
    },
    expandedDrawerMaxHeight: {
        maxHeight: WINDOW_HEIGHT * 0.4, 
    },
    gridWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: l(5),
    },
    dayCell: {
        width: `${100 / 7}%`, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: a(8),
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
    dateCircleActiveToday:{
        backgroundColor: Colors.errorDisable,
    },
    dayOfMonthText: {
        fontSize: td(14),
        fontFamily: fonts.robotoRegular,
        color: Colors.corText,
    },
    activeTextCircle: {
        color: Colors.white,
        fontFamily: fonts.robotoBold
    },
    activeTextCircleToday:{
        color: Colors.error,
        fontFamily: fonts.robotoBold
    },

    drawerHandle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomColor:Colors.border,
        borderBottomWidth:1,
        borderBottomLeftRadius: td(12), 
        borderBottomRightRadius: td(12),
        paddingBottom:a(5)
    },
    
});