// src/components/calendar/StaffDailyView.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import Animated, { 
    useAnimatedScrollHandler, 
    useSharedValue, 
    useAnimatedRef, 
    scrollTo, 
    useAnimatedReaction 
} from 'react-native-reanimated';

import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';
import { StatusTheme, AppointmentStatus } from '@/types/status'; 

import { TimeAxis } from './TimeAxis';
import { TimeGrid } from './TimeGrid';
import { getGlobalWorkBounds } from '@/utils/workTimeEngine'; 
import { processEmployeeAppointments } from '@/utils/overLapEngine';
import { Colors } from '@/colors/color';
import { Ionicons } from '@expo/vector-icons';

const WINDOW_WIDTH = Dimensions.get('window').width;
export const AXIS_WIDTH = l(30); 
export const COLUMN_WIDTH = l(140); 
export const HEADER_HEIGHT = a(40);

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
    
    // Refs para controle programático dos ScrollViews via UI Thread (Worklets)
    const headerRef = useAnimatedRef<Animated.ScrollView>();
    const gridRef = useAnimatedRef<Animated.ScrollView>();

    // Estado compartilhado (C++) para posição do eixo X e quem está controlando o gesto
    const scrollX = useSharedValue(0);
    const activeScroller = useSharedValue(0); // 0 = Nenhum, 1 = Cabeçalho, 2 = Grid

    // Handlers para capturar o movimento e registrar a intenção do usuário
    const onHeaderScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            if (activeScroller.value === 1) {
                scrollX.value = e.contentOffset.x;
            }
        },
        onBeginDrag: () => { activeScroller.value = 1; },
    });

    const onGridScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            if (activeScroller.value !== 1) {
                scrollX.value = e.contentOffset.x;
            }
        },
        onBeginDrag: () => { activeScroller.value = 2; },
    });

    // Motor de Reação (Reaction Engine): Sincroniza o componente "escravo" com o "mestre" a 60FPS
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

    const dynamicColumnWidth = employees.length === 1 
        ? WINDOW_WIDTH - AXIS_WIDTH 
        : COLUMN_WIDTH;

    // Obtém a hora inicial de operação (agora com a margem de segurança do motor)
    const { startHour } = useMemo(() => getGlobalWorkBounds(operatingHours), [operatingHours]);

    return (
        <View style={styles.container}>
            
            {/* SCROLL VERTICAL MESTRE */}
            <ScrollView 
                style={styles.masterVerticalScroll}
                contentContainerStyle={styles.masterVerticalContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]} // Trava o Header no topo da tela durante o scroll para baixo
                refreshControl={
                    onRefresh ? <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={['#FF7A00']} /> : undefined
                }
            >
                {/* CABEÇALHO (Sticky) */}
                <View style={styles.headerRow}>
                    <View style={{width:AXIS_WIDTH, height:HEADER_HEIGHT, backgroundColor:Colors.white, zIndex:50, position:"absolute"}}></View>
                    <Animated.ScrollView
                        ref={headerRef}
                        horizontal
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={onHeaderScroll}
                        scrollEventThrottle={16}
                        style={styles.headerScrollContainer}
                    >
                        <View style={styles.cornerBlock} />
                        {employees.map(emp => (
                            <View key={`header-${emp.id}`} style={[styles.employeeHeader, { width: dynamicColumnWidth }]}>
                                <View style={{backgroundColor:Colors.gray, width:td(30), height:td(30), borderRadius:td(15), marginRight:l(5), justifyContent:"center", alignItems:"center"}}>
                                    <Ionicons name='person' color={Colors.corContainer} size={td(20)}/>
                                </View>
                                <View>
                                    <Text style={styles.employeeName} numberOfLines={1}>{emp.name}</Text>
                                    <Text style={styles.employeeRole} numberOfLines={1}>{emp.name}</Text>
                                </View>
                            </View>
                        ))}
                    </Animated.ScrollView>
                </View>

                {/* CORPO / GRID DE AGENDAMENTOS */}
                <View style={styles.bodyRow}>
                    <View style={styles.timeAxisContainer}>
                        <TimeAxis operatingHours={operatingHours} />
                    </View>

                    {/* Grade Horizontal Rolável */}
                    <Animated.ScrollView 
                        ref={gridRef}
                        horizontal 
                        bounces={false} 
                        showsHorizontalScrollIndicator={false}
                        onScroll={onGridScroll}
                        scrollEventThrottle={16}
                        style={styles.matrixHorizontalScroll}
                    >
                        {employees.map(emp => {
                            const empAppointments = processEmployeeAppointments(appointments, emp.id, date, startHour);
                            
                            return (
                                <View key={`col-${emp.id}`} style={[styles.employeeColumn, { width: dynamicColumnWidth }]}>
                                    <TimeGrid date={date} operatingHours={operatingHours} />
                                    
                                    {empAppointments.map(appt => {
                                        const currentStatus = (appt.status as AppointmentStatus) || AppointmentStatus.PENDING_CONFIRMATION;
                                        const theme = StatusTheme[currentStatus] || StatusTheme[AppointmentStatus.PENDING_CONFIRMATION];
                                        
                                        const clientName = appt.clientName || (appt.clientId && appt.clientName) || 'Cliente';

                                        return (
                                            <View 
                                                key={appt.appointmentId || appt.appointmentId || appt.startTime} 
                                                style={[
                                                    styles.appointmentCard, 
                                                    { 
                                                        top: appt.layout.top, 
                                                        height: appt.layout.height, 
                                                        left: appt.layout.left, 
                                                        width: appt.layout.width,
                                                        backgroundColor: theme.bg,
                                                        borderColor: theme.border,
                                                        zIndex: appt.layout.zIndex 
                                                    }
                                                ]}
                                            >
                                                <View style={[styles.statusIndicator, { backgroundColor: theme.text }]} />
                                                <View style={styles.cardContent}>
                                                    <Text style={[styles.clientName, { color: theme.text }]} numberOfLines={1}>
                                                        {clientName}
                                                    </Text>
                                                    <Text style={[styles.serviceName, { color: theme.text }]} numberOfLines={1}>
                                                        {appt.serviceName || (appt.serviceId && appt.serviceName)}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </Animated.ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    
    // Configurações do Master Scroll
    masterVerticalScroll: { 
        flex: 1 
    },
    masterVerticalContent: { 
        flexGrow: 1, 
        paddingBottom: a(50) 
    },
    
    // Cabeçalho Fixo
    headerRow: { 
        flexDirection: 'row', 
        height: HEADER_HEIGHT, 
        zIndex: 10, 
        backgroundColor: '#FFFFFF' 
    },
    // Z-Index 20 garante que o scroll de texto passe estritamente "por baixo" deste bloco
    cornerBlock: { 
        width: AXIS_WIDTH, 
        backgroundColor: Colors.white,
        zIndex: 20 
    },
    headerScrollContainer: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    
    employeeHeader: { 
        height: HEADER_HEIGHT, 
        flexDirection:"row",
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRightWidth: 1, 
        borderRightColor: '#E2E8F0', 
        paddingHorizontal: l(8) 
    },
    employeeName: { 
        fontSize: td(12), 
        fontFamily: fonts?.robotoMedium, 
        color: Colors.corText
    },
    employeeRole: { 
        fontSize: td(10), 
        fontFamily: fonts?.robotoRegular, 
        color: Colors.corTextSecondary, 
   
    },

    // Corpo da Agenda
    bodyRow: { 
        flexDirection: 'row', 
        flex: 1 
    },
    timeAxisContainer: { 
        width: l(30), 
        borderRightWidth: 1, 
        borderRightColor: '#E2E8F0', 
        backgroundColor: '#F8FAFC',
        zIndex: 10
    },
    matrixHorizontalScroll: { 
        flex: 1 
    },
    employeeColumn: { 
        borderRightWidth: 1, 
        borderRightColor: '#F1F5F9', 
        position: 'relative' 
    },
    
    // Cards de Agendamento
    appointmentCard: { 
        position: 'absolute', 
        borderRadius: td(6), 
        borderWidth: 1, 
        padding: td(4), 
        flexDirection: 'row', 
        overflow: 'hidden' 
    },
    statusIndicator: { 
        width: td(4), 
        height: '100%', 
        borderRadius: td(2), 
        marginRight: l(4) 
    },
    cardContent: { 
        flex: 1, 
        justifyContent: 'flex-start' 
    },
    clientName: { 
        fontSize: td(12), 
        fontFamily: fonts?.robotoBold || 'System' 
    },
    serviceName: { 
        fontSize: td(11), 
        fontFamily: fonts?.robotoRegular || 'System', 
        marginTop: a(2) 
    },
});