import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, Dimensions } from 'react-native';

import { AgendaHeader } from './AgendaHeader';
import { StaffDailyView } from './StaffDailyView'; 
import { MonthPickerModal } from './MonthPickerModal'; 
import { DailyLoadingPlaceholder } from './DailyLoadingPlaceholder'; 

import { useAgendaNavigation, ViewMode } from '../../hooks/useAgendaNavigation';
import { useAgendaAppointments } from '@/hooks/useAgendaAppointments';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees'; 

const WINDOW_WIDTH = Dimensions.get('window').width;

function getVisibleDaysForDate(baseDate: Date, viewMode: ViewMode): Date[] {
    const days: Date[] = [];
    const base = new Date(baseDate);
    base.setHours(0, 0, 0, 0);

    if (viewMode === 'DAY') {
        days.push(base);
    } else if (viewMode === 'WEEK') {
        const dayOfWeek = base.getDay();
        const startOfWeek = new Date(base);
        startOfWeek.setDate(base.getDate() - dayOfWeek);
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
    }
    return days;
}

export const CalendarPager = () => {
    // Substituímos o PagerView pelo ScrollView nativo
    const scrollRef = useRef<ScrollView>(null);
    const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
    
    const [transitionType, setTransitionType] = useState<'DAY' | 'MAJOR'>('DAY');
    const [isForcedLoading, setIsForcedLoading] = useState(false);
    const forcedLoadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const { 
        selectedDate, 
        setSelectedDate,
        viewMode, 
        changeViewMode, 
        visibleDays
    } = useAgendaNavigation();

    const { 
        data: appointments = [], 
        isRefetching,
        isFetching, 
        refetch 
    } = useAgendaAppointments(selectedDate);

    const { data: company } = useMyCompany();
    const operatingHours = company?.operatingHours || [];
    const { data: employees = [] } = useCompanyEmployees();

    const triggerForcedLoading = (durationMs: number) => {
        setIsForcedLoading(true);
        if (forcedLoadingTimeout.current) {
            clearTimeout(forcedLoadingTimeout.current);
        }
        forcedLoadingTimeout.current = setTimeout(() => {
            setIsForcedLoading(false);
        }, durationMs);
    };

    useEffect(() => {
        return () => {
            if (forcedLoadingTimeout.current) clearTimeout(forcedLoadingTimeout.current);
        };
    }, []);

    const isApiLoading = isFetching && !isRefetching;
    const isLoadingData = isApiLoading || isForcedLoading;

    const currentVisibleDays = visibleDays;

    const prevVisibleDays = useMemo(() => {
        const prevDate = new Date(selectedDate);
        if (viewMode === 'DAY') prevDate.setDate(prevDate.getDate() - 1);
        else if (viewMode === 'WEEK') prevDate.setDate(prevDate.getDate() - 7);
        return getVisibleDaysForDate(prevDate, viewMode);
    }, [selectedDate, viewMode]);

    const nextVisibleDays = useMemo(() => {
        const nextDate = new Date(selectedDate);
        if (viewMode === 'DAY') nextDate.setDate(nextDate.getDate() + 1);
        else if (viewMode === 'WEEK') nextDate.setDate(nextDate.getDate() + 7);
        return getVisibleDaysForDate(nextDate, viewMode);
    }, [selectedDate, viewMode]);

    // Ancoragem Silenciosa: Toda vez que a data muda por qualquer motivo, travamos o scroll no meio
    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollRef.current?.scrollTo({ x: WINDOW_WIDTH, y: 0, animated: false });
        }, 0);
        return () => clearTimeout(timeout);
    }, [selectedDate]);

    // ========================================================================
    // MOTOR DE CARROSSEL INFINITO (Swipe Manual do Usuário)
    // ========================================================================
    const handleMomentumScrollEnd = (e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        
        // Se arrastou para a página 0 (Passado)
        if (x < WINDOW_WIDTH / 2) {
            setTransitionType('DAY'); 
            triggerForcedLoading(400); // Reduzimos o tempo pois a animação física já cobriu a transição

            const newDate = new Date(selectedDate);
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() - 1);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() - 7);
            
            setSelectedDate(newDate);
        } 
        // Se arrastou para a página 2 (Futuro)
        else if (x > WINDOW_WIDTH * 1.5) {
            setTransitionType('DAY');  
            triggerForcedLoading(400);

            const newDate = new Date(selectedDate);
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() + 1);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() + 7);
            
            setSelectedDate(newDate);
        }
    };

    // ========================================================================
    // MOTOR DE OVERSCROLL DO STAFF DAILY VIEW (Ação Programática)
    // ========================================================================
    const handleOverscrollNavigation = (direction: 'PREV' | 'NEXT') => {
        // Ao invés de setar a data direto, nós forçamos o ScrollView a rolar visualmente!
        // Quando a rolagem terminar, o `handleMomentumScrollEnd` acima será chamado automaticamente.
        if (direction === 'PREV') {
            scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        } else {
            scrollRef.current?.scrollTo({ x: WINDOW_WIDTH * 2, y: 0, animated: true });
        }
    };

    const handleHeaderDateNavigation = (direction: 'PREV' | 'NEXT', temporalMode: 'WEEK' | 'MONTH') => {
        setTransitionType('MAJOR'); 
        triggerForcedLoading(800);

        const newDate = new Date(selectedDate);
        if (temporalMode === 'WEEK') {
            newDate.setDate(newDate.getDate() + (direction === 'NEXT' ? 7 : -7));
            newDate.setDate(newDate.getDate() - newDate.getDay());
        } else {
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + (direction === 'NEXT' ? 1 : -1));
        }
        
        setSelectedDate(newDate);
    };

    const handleSelectMonthYear = (year: number, month: number) => {
        setTransitionType('MAJOR'); 
        const newDate = new Date(selectedDate);
        newDate.setFullYear(year);
        newDate.setMonth(month);
        newDate.setDate(1); 
        setSelectedDate(newDate);
    };

    const handleHeaderDayPress = (date: Date) => {
        setTransitionType('DAY');
        changeViewMode('DAY', date);
    };

    const handleOpenMonthPicker = () => setIsMonthPickerVisible(true);
    const handleCloseMonthPicker = () => setIsMonthPickerVisible(false);

    const renderPageContent = (daysArray: Date[], isAdjacentPage: boolean = false) => {
        if (viewMode === 'DAY') {
            // As páginas laterais SEMPRE carregam o Placeholder (Custo Zero de RAM)
            if (isAdjacentPage || (transitionType === 'DAY' && isLoadingData)) {
                return <DailyLoadingPlaceholder date={daysArray[0]} />;
            }

            return (
                <StaffDailyView 
                    date={daysArray[0]} 
                    appointments={appointments} 
                    employees={employees} 
                    operatingHours={operatingHours} 
                    isRefetching={isRefetching} 
                    onRefresh={refetch} 
                    onNavigateDay={handleOverscrollNavigation}
                />
            );
        } else {
            return (
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>Visão Semanal em Construção</Text>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <AgendaHeader 
                selectedDate={selectedDate}
                visibleDays={visibleDays}
                onOpenMonthPicker={handleOpenMonthPicker} 
                onDayPress={handleHeaderDayPress}
                onNavigateDate={handleHeaderDateNavigation}
            />

            {/* O PagerView antigo foi substituído por este ScrollView Carrossel de Alta Performance */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                bounces={false}
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                contentOffset={{ x: WINDOW_WIDTH, y: 0 }} // Inicia sempre focado no centro (Página 1)
                scrollEventThrottle={16}
                style={styles.pager}
            >
                <View style={{ width: WINDOW_WIDTH }}>
                    {renderPageContent(prevVisibleDays, true)}
                </View>
                <View style={{ width: WINDOW_WIDTH }}>
                    {renderPageContent(currentVisibleDays, false)}
                </View>
                <View style={{ width: WINDOW_WIDTH }}>
                    {renderPageContent(nextVisibleDays, true)}
                </View>
            </ScrollView>

            <MonthPickerModal 
                isVisible={isMonthPickerVisible}
                onClose={handleCloseMonthPicker}
                selectedDate={selectedDate}
                onSelectMonth={handleSelectMonthYear}
            />

            {transitionType === 'MAJOR' && isLoadingData && (
                <View style={styles.globalOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    pager: { flex: 1 },
    placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    placeholderText: { color: '#64748B' },
    globalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000, 
        justifyContent: 'center',
        alignItems: 'center',
    }
});