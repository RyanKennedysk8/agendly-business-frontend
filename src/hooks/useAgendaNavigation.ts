import { useState, useCallback, useMemo } from 'react';

export type ViewMode = 'DAY' | 'THREE_DAYS' | 'WEEK' | 'MONTH';

export const useAgendaNavigation = (initialDate: Date = new Date()) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [viewMode, setViewMode] = useState<ViewMode>('DAY');

    // Âncora virtual para o PagerView
    const VIRTUAL_ANCHOR = 5000;

    const changeViewMode = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        setSelectedDate(new Date()); // Faz reset para o dia atual ao mudar de visão
    }, []);

    // Calcula os dias que preenchem as colunas do ecrã atual
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

    // Função que traduz o deslize do ecrã em cálculo matemático de data
    const navigateByPageOffset = useCallback((pageIndex: number) => {
        const offset = pageIndex - VIRTUAL_ANCHOR;
        const newDate = new Date(); // Base fixa ancorada no "Hoje"
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