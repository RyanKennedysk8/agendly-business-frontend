import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { AgendaHeader } from './AgendaHeader';
import { DailyViewBase } from './DailyViewBase';
import { MonthView } from './MonthView';
import { MonthPickerModal } from './MonthPickerModal'; // Inclusão do novo Modal

import { useAgendaNavigation, ViewMode } from '../../hooks/useAgendaNavigation';
import { AppointmentDetail } from '@/types/appointments';

interface CalendarPagerProps {
    appointments: AppointmentDetail[];
    staffList: any[];
}

function getVisibleDaysForDate(baseDate: Date, viewMode: ViewMode): Date[] {
    const days: Date[] = [];
    const base = new Date(baseDate);
    base.setHours(0, 0, 0, 0);

    if (viewMode === 'DAY') {
        days.push(base);
    } else if (viewMode === 'THREE_DAYS') {
        for (let i = 0; i < 3; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            days.push(d);
        }
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

export const CalendarPager = ({ appointments = [], staffList = [] }: CalendarPagerProps) => {
    const pagerRef = useRef<PagerView>(null);
    
    // Controle de estado local para visibilidade do Modal de UX
    const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
    
    const { 
        selectedDate, 
        setSelectedDate,
        viewMode, 
        changeViewMode, 
        visibleDays
    } = useAgendaNavigation();

    const currentVisibleDays = visibleDays;

    const prevVisibleDays = useMemo(() => {
        const prevDate = new Date(selectedDate);
        if (viewMode === 'DAY') prevDate.setDate(prevDate.getDate() - 1);
        else if (viewMode === 'THREE_DAYS') prevDate.setDate(prevDate.getDate() - 3);
        else if (viewMode === 'WEEK') prevDate.setDate(prevDate.getDate() - 7);
        return getVisibleDaysForDate(prevDate, viewMode);
    }, [selectedDate, viewMode]);

    const nextVisibleDays = useMemo(() => {
        const nextDate = new Date(selectedDate);
        if (viewMode === 'DAY') nextDate.setDate(nextDate.getDate() + 1);
        else if (viewMode === 'THREE_DAYS') nextDate.setDate(nextDate.getDate() + 3);
        else if (viewMode === 'WEEK') nextDate.setDate(nextDate.getDate() + 7);
        return getVisibleDaysForDate(nextDate, viewMode);
    }, [selectedDate, viewMode]);

    const handlePageSelected = (e: any) => {
        const position = e.nativeEvent.position;
        if (position === 1) return;

        const newDate = new Date(selectedDate);
        if (position === 2) {
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() + 1);
            else if (viewMode === 'THREE_DAYS') newDate.setDate(newDate.getDate() + 3);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() + 7);
        } else if (position === 0) {
            if (viewMode === 'DAY') newDate.setDate(newDate.getDate() - 1);
            else if (viewMode === 'THREE_DAYS') newDate.setDate(newDate.getDate() - 3);
            else if (viewMode === 'WEEK') newDate.setDate(newDate.getDate() - 7);
        }

        setSelectedDate(newDate);

        setTimeout(() => {
            pagerRef.current?.setPageWithoutAnimation(1);
        }, 50);
    };

    // Callback acionado quando o gestor escolhe uma data no Modal
    const handleSelectMonthYear = (year: number, month: number) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(year);
        newDate.setMonth(month);
        // Reseta para o dia 1 do mês selecionado para evitar estouros de dias (ex: 31 de fevereiro)
        newDate.setDate(1); 
        setSelectedDate(newDate);
    };

    const handleOpenMonthPicker = () => setIsMonthPickerVisible(true);
    const handleCloseMonthPicker = () => setIsMonthPickerVisible(false);

    const handleHeaderDayPress = (date: Date) => {
        changeViewMode('DAY', date);
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

            {viewMode === 'MONTH' ? (
                <MonthView 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    appointments={appointments}
                />
            ) : (
                <PagerView
                    key={viewMode}
                    ref={pagerRef}
                    style={styles.pager}
                    initialPage={1}
                    onPageSelected={handlePageSelected}
                    overScrollMode="never"
                >
                    <View key="page-prev" style={styles.pageWrapper}>
                        <DailyViewBase visibleDays={prevVisibleDays} appointments={appointments} />
                    </View>
                    <View key="page-current" style={styles.pageWrapper}>
                        <DailyViewBase visibleDays={currentVisibleDays} appointments={appointments} />
                    </View>
                    <View key="page-next" style={styles.pageWrapper}>
                        <DailyViewBase visibleDays={nextVisibleDays} appointments={appointments} />
                    </View>
                </PagerView>
            )}

            {/* Injeção de renderização controlada do Modal de UX */}
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
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    pager: {
        flex: 1
    },
    pageWrapper: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    }
});