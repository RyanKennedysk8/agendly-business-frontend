import { useState, useCallback, useMemo } from 'react';

export type ViewMode = 'DAY' | 'THREE_DAYS' | 'WEEK' | 'MONTH';

export const useAgendaNavigation = (initialDate: Date = new Date()) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [viewMode, setViewMode] = useState<ViewMode>('DAY');

    const VIRTUAL_ANCHOR = 5000;

    // Adicionado parâmetro opcional 'targetDate'
    const changeViewMode = useCallback((mode: ViewMode, targetDate?: Date) => {
        setViewMode(mode);
        // Se o evento enviou uma data específica (clique no header), vá para ela.
        // Se não enviou nada (clique na Tab), reseta para o dia de "Hoje".
        if (targetDate) {
            setSelectedDate(targetDate);
        } else {
            setSelectedDate(new Date()); 
        }
    }, []);

    const visibleDays = useMemo(() => {
        const days: Date[] = [];
        const base = new Date(selectedDate);
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
    }, [selectedDate, viewMode]);

    const navigateByPageOffset = useCallback((pageIndex: number) => {
        const offset = pageIndex - VIRTUAL_ANCHOR;
        const newDate = new Date(); 
        newDate.setHours(0, 0, 0, 0);

        switch (viewMode) {
            case 'DAY':
                newDate.setDate(newDate.getDate() + offset);
                break;
            case 'THREE_DAYS':
                newDate.setDate(newDate.getDate() + (offset * 3));
                break;
            case 'WEEK':
                newDate.setDate(newDate.getDate() + (offset * 7));
                break;
            default:
                return;
        }
        setSelectedDate(newDate);
    }, [viewMode]);

    return {
        selectedDate,
        setSelectedDate,
        viewMode,
        changeViewMode,
        visibleDays,
        VIRTUAL_ANCHOR,
        navigateByPageOffset
    };
};