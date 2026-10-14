import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, Image } from 'react-native';
import Animated, {
    scrollTo,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { verticalScale as a, scale as l, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';
import { TimeAxis } from './TimeAxis';
import { TimeGrid } from './TimeGrid';
import { getDailyWorkBounds} from '@/utils/workTimeEngine';
import { processEmployeeAppointments } from '@/utils/overLapEngine';
import { Colors} from '@/colors/color';
import { MINUTE_HEIGHT } from '@/utils/calendarMetrics';
import { AXIS_WIDTH, COLUMN_WIDTH, HEADER_HEIGHT } from '@/components/calendar/styles/constants/calendarLayout';
import { CalendarColors } from './styles/constants/calendarColors';
import { getThemeForAppointment } from '@/utils/appointmentUtils';

const WINDOW_WIDTH = Dimensions.get('window').width;

const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const formatLocalTime = (timeStr?: string) => {
    if (!timeStr) return '';
    return timeStr.split(':').slice(0, 2).join(':');
};

const getEmployeeHoursForToday = (employee: any, date: Date, storeOperatingHours: any[]) => {
    const todayStr = DAYS_MAP[date.getDay()];

    if (employee.specificOperatingHours && employee.specificOperatingHours.length > 0) {
        const empSchedule = employee.specificOperatingHours.find((h: any) => h.daysOfWeek?.includes(todayStr));
        if (empSchedule && empSchedule.openingTime && empSchedule.closingTime) {
            return `${formatLocalTime(empSchedule.openingTime)} - ${formatLocalTime(empSchedule.closingTime)}`;
        }
    }

    if (storeOperatingHours && storeOperatingHours.length > 0) {
        const storeSchedule = storeOperatingHours.find((h: any) => h.daysOfWeek?.includes(todayStr));
        if (storeSchedule && storeSchedule.openingTime && storeSchedule.closingTime) {
            return `${formatLocalTime(storeSchedule.openingTime)} - ${formatLocalTime(storeSchedule.closingTime)}`;
        }
    }

    return 'Folga / Fechado';
};



const formatApptTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

interface StaffDailyViewProps {
    date: Date;
    appointments: any[];
    employees: any[]; 
    operatingHours: any[];
    isRefetching?: boolean;
    onRefresh?: () => void;
}

export const StaffDailyView = ({ 
    date, 
    appointments, 
    employees, 
    operatingHours,
    isRefetching = false,
    onRefresh
}: StaffDailyViewProps) => {
    
    const headerRef = useAnimatedRef<Animated.ScrollView>();
    const gridRef = useAnimatedRef<Animated.ScrollView>();

    const scrollX = useSharedValue(0);
    const activeScroller = useSharedValue(0); 

    const dynamicColumnWidth = employees.length === 1 
        ? WINDOW_WIDTH - AXIS_WIDTH 
        : COLUMN_WIDTH;

    const onHeaderScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            if (activeScroller.value === 1) {
                scrollX.value = e.contentOffset.x;
            }
        },
        onBeginDrag: () => { activeScroller.value = 1; }
    });

    const onGridScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            if (activeScroller.value !== 1) {
                scrollX.value = e.contentOffset.x;
            }
        },
        onBeginDrag: () => { activeScroller.value = 2; }
    });

    useAnimatedReaction(
        () => scrollX.value,
        (x) => {
            if (activeScroller.value === 1) {
                scrollTo(gridRef, x, 0, false);
            } else if (activeScroller.value === 2) {
                scrollTo(headerRef, x, 0, false);
            }
        }
    );

    const { startHour, endHour } = useMemo(() => getDailyWorkBounds(operatingHours, date), [operatingHours, date]);

    const GRID_HEIGHT = useMemo(() => {
        const totalMinutes = (endHour - startHour) * 60;
        return (totalMinutes) * MINUTE_HEIGHT; 
    }, [startHour, endHour]);

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.masterVerticalScroll}
                contentContainerStyle={styles.masterVerticalContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]} 
                refreshControl={
                    onRefresh ? <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={['#FF7A00']} /> : undefined
                }
            >
                <View style={styles.headerRow}>
                    <View style={{width: AXIS_WIDTH, height: HEADER_HEIGHT, backgroundColor: Colors.white, zIndex: 50, position: "absolute"}} />
                    
                    <Animated.ScrollView
                        ref={headerRef}
                        horizontal
                        bounces={false} 
                        overScrollMode="never" 
                        showsHorizontalScrollIndicator={false}
                        onScroll={onHeaderScroll}
                        scrollEventThrottle={16}
                        style={styles.headerScrollContainer}
                    >
                        <View style={[{ flexDirection: 'row' }]}>
                            <View style={styles.cornerBlock} />
                            {employees.map((emp, index) => (
                                <View
                                    key={emp.id}
                                    style={[
                                        styles.employeeHeader,
                                        {
                                            width: dynamicColumnWidth,
                                            borderRightWidth: index === employees.length - 1 ? 0 : 1,
                                            borderRightColor: CalendarColors.dayDivider,
                                        },
                                    ]}
                                >
                                    <View style={styles.containerAvatar}>
                                        {emp.photoUrl ? (
                                            <Image source={{ uri: emp.photoUrl }} style={[styles.avatar]} />
                                        ):(
                                            <Text style={styles.initials}>
                                                {emp.name.charAt(0).toUpperCase()}{emp.name.charAt(1).toUpperCase()}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.employeeName} numberOfLines={1}>{emp.name}</Text>
                                        <Text style={styles.employeeOperatingHours} numberOfLines={1}>
                                            {getEmployeeHoursForToday(emp, date, operatingHours)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Animated.ScrollView>
                </View>

                <View style={[styles.bodyRow, { height: GRID_HEIGHT }]}>
                    
                    <View style={styles.timeAxisContainer}>
                        <TimeAxis date={date} operatingHours={operatingHours} />
                    </View>

                    <Animated.ScrollView 
                        ref={gridRef}
                        horizontal 
                        bounces={false} 
                        overScrollMode="never" 
                        showsHorizontalScrollIndicator={false}
                        onScroll={onGridScroll}
                        scrollEventThrottle={16}
                        style={styles.matrixHorizontalScroll}
                    >
                        <View style={[{ flexDirection: 'row' }]}>
                            {employees.map((emp, index) => {
                                const empAppointments = processEmployeeAppointments(appointments, emp.id, date, startHour);
                                return (
                                    <View
                                        key={emp.id}
                                        style={[
                                            styles.employeeColumn,
                                            {
                                                width: dynamicColumnWidth,
                                                borderRightWidth: index === employees.length - 1 ? 0 : 1,
                                                borderRightColor: CalendarColors.dayDivider,
                                            },
                                        ]}
                                    >
                                        <TimeGrid date={date} operatingHours={operatingHours} employee={emp} />
                                       
                                        {empAppointments.map(appt => {
                                            const { theme } = getThemeForAppointment(appt);
                                            const clientName = appt.clientName || (appt.clientId && appt.clientName) || 'Cliente';
                                            const serviceName = appt.serviceName || (appt.serviceId && appt.serviceName) || 'Serviço';
                                            const timeLabel = `${formatApptTime(appt.startTime)} - ${formatApptTime(appt.endTime)}`;
                                            
                                            const isUltraShort = appt.layout.height <= a(45);

                                            return (
                                                <View 
                                                    key={appt.appointmentId || appt.companyId || appt.startTime} 
                                                    style={[
                                                        styles.appointmentCard, 
                                                        { 
                                                            top: appt.layout.top, 
                                                            height: appt.layout.height, 
                                                            left: appt.layout.left, 
                                                            width: appt.layout.width,
                                                            backgroundColor: theme.bg,
                                                            borderColor: theme.border,
                                                            zIndex: appt.layout.zIndex || 10,
                                                        }
                                                    ]}
                                                >
                                                    <View style={[styles.statusIndicator, { backgroundColor: theme.text }]} />
                                                    
                                                    {isUltraShort ? (
                                                        <View style={styles.cardContentShort}>
                                                            <Text style={[styles.timeText, { color: theme.text }]} numberOfLines={1}>
                                                                {timeLabel} <Text style={styles.dotSeparator}>•</Text> {serviceName}
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.cardContent}>
                                                            <Text style={[styles.timeText, { color: theme.text }]} numberOfLines={1}>
                                                                {timeLabel}
                                                            </Text>
                                                            <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>
                                                                {serviceName}
                                                            </Text>
                                                            <Text style={[styles.clientName, { color: theme.text, marginTop: a(2) }]} numberOfLines={1}>
                                                                {clientName}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    </Animated.ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
  
    masterVerticalScroll: {
      flex: 1,
    },
  
    masterVerticalContent: {
      flexGrow: 1,
    },
  
    headerRow: {
      flexDirection: 'row',
      height: HEADER_HEIGHT,
      zIndex: 10,
    },
  
    cornerBlock: {
      width: AXIS_WIDTH,
      backgroundColor: Colors.white,
      zIndex: 20,
    },
  
    headerScrollContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
  
    employeeHeader: {
      height: HEADER_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: l(5),
    },
  
    employeeName: {
      fontSize: td(12),
      fontFamily: fonts?.robotoMedium,
      color: Colors.corText,
    },
  
    employeeOperatingHours: {
      fontSize: td(10),
      fontFamily: fonts?.robotoRegular,
      color: Colors.corTextSecondary,
    },
  
    bodyRow: {
      flexDirection: 'row',
      flex: 1,
    },
  
    timeAxisContainer: {
      width: l(30),
      backgroundColor: Colors.white,
      zIndex: 100,
    },
  
    matrixHorizontalScroll: {
      flex: 1,
    },
  
    employeeColumn: {
      position: 'relative',
    },
  
    appointmentCard: {
      position: 'absolute',
      borderRadius: td(6),
      borderWidth: 1,
      padding: td(4),
      flexDirection: 'row',
      overflow: 'hidden',
    },
  
    statusIndicator: {
      width: td(4),
      height: '100%',
      borderRadius: td(2),
      marginRight: l(4),
    },
  
    cardContent: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingLeft: l(2),
    },
  
    cardContentShort: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: l(2),
    },
  
    timeText: {
      fontSize: td(10),
      fontFamily: fonts?.robotoRegular,
    },
  
    serviceName: {
      fontSize: td(12),
      fontFamily: fonts?.robotoRegular,
      marginTop: a(2),
    },
  
    clientName: {
      fontSize: td(11),
      fontFamily: fonts?.robotoRegular,
      opacity: 0.8,
    },
  
    dotSeparator: {
      fontSize: td(10),
      opacity: 0.5,
    },
  
    initials: {
      fontSize: td(14),
      fontFamily: fonts?.robotoMedium || 'System',
      color: Colors.corTextSecondary,
    },
  
    containerAvatar: {
      backgroundColor: Colors.gray || '#F1F5F9',
      width: td(30),
      height: td(30),
      borderRadius: td(15),
      marginRight: l(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    avatar: {
      width: td(30),
      height: td(30),
      borderRadius: td(15),
      backgroundColor: Colors.corContainer || '#E2E8F0',
    },
  });