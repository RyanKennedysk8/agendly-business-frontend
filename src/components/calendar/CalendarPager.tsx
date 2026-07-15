import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PagerView from 'react-native-pager-view';

import { AgendaHeader } from './AgendaHeader';
import { StaffDailyView } from './StaffDailyView'; 
import { MonthPickerModal } from './MonthPickerModal'; 

import { useAgendaNavigation, ViewMode } from '../../hooks/useAgendaNavigation';
import { useAgendaAppointments } from '@/hooks/useAgendaAppointments';
import { useMyCompany } from '@/hooks/useMyCompany';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees'; 

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
    const pagerRef = useRef<PagerView>(null);
    
    const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
    
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
        refetch 
    } = useAgendaAppointments(selectedDate);

    const { data: company } = useMyCompany();
    const operatingHours = company?.operatingHours || [];

    const { data: employees = [] } = useCompanyEmployees();

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

    const handlePageSelected = (e: any) => {
        const position = e.nativeEvent.position;
        if (position === 1) return;

        const newDate = new Date(selectedDate);
        if (position === 2) {
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() + 1);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() + 7);
        } else if (position === 0) {
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() - 1);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() - 7);
        }

        setSelectedDate(newDate);

        setTimeout(() => {
            pagerRef.current?.setPageWithoutAnimation(1);
        }, 50);
    };

    // DELEGAÇÃO DO OVERSCROLL PARA O PAGERVIEW NATIVO
    const handleOverscrollNavigation = (direction: 'PREV' | 'NEXT') => {
        if (direction === 'PREV') {
            pagerRef.current?.setPage(0);
        } else {
            pagerRef.current?.setPage(2);
        }
    };

    const handleSelectMonthYear = (year: number, month: number) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(year);
        newDate.setMonth(month);
        newDate.setDate(1); 
        setSelectedDate(newDate);
    };

    const handleOpenMonthPicker = () => setIsMonthPickerVisible(true);
    const handleCloseMonthPicker = () => setIsMonthPickerVisible(false);

    const handleHeaderDayPress = (date: Date) => {
        changeViewMode('DAY', date);
    };

    const renderPageContent = (daysArray: Date[]) => {
        if (viewMode === 'DAY') {
            return (
                <StaffDailyView 
                    date={daysArray[0]} 
                    appointments={appointments} 
                    employees={employees} 
                    operatingHours={operatingHours} 
                    isRefetching={isRefetching} 
                    onRefresh={refetch} 
                    onNavigateDay={handleOverscrollNavigation} // INJEÇÃO DA CHAMADA AQUI
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
                viewMode={viewMode}
                onChangeViewMode={changeViewMode}
                visibleDays={visibleDays}
                onOpenMonthPicker={handleOpenMonthPicker} 
                onDayPress={handleHeaderDayPress}
            />

            <PagerView
                key={viewMode}
                ref={pagerRef}
                style={styles.pager}
                initialPage={1}
                onPageSelected={handlePageSelected}
                overScrollMode="never"
            >
                <View key="page-prev" style={styles.pageWrapper}>
                    {renderPageContent(prevVisibleDays)}
                </View>
                <View key="page-current" style={styles.pageWrapper}>
                    {renderPageContent(currentVisibleDays)}
                </View>
                <View key="page-next" style={styles.pageWrapper}>
                    {renderPageContent(nextVisibleDays)}
                </View>
            </PagerView>

            <MonthPickerModal 
                isVisible={isMonthPickerVisible}
                onClose={handleCloseMonthPicker}
                selectedDate={selectedDate}
                onSelectMonth={handleSelectMonthYear}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    pager: { flex: 1 },
    pageWrapper: { flex: 1, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    placeholderText: { color: '#64748B' }
});