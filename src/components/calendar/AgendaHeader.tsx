import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ViewMode } from '../../hooks/useAgendaNavigation';
import { agendaHeaderStyles } from './styles/agendaHeaderStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';

interface AgendaHeaderProps {
    selectedDate: Date;
    viewMode: ViewMode;
    onChangeViewMode: (mode: 'DAY' | 'THREE_DAYS' | 'WEEK' | 'MONTH', date?: Date) => void;
    visibleDays: Date[];
    onOpenMonthPicker: () => void; // Gatilho para abrir o modal de seleção de mês no futuro
    onDayPress?: (date: Date) => void;

}

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
    { label: 'Dia', value: 'DAY' },
    { label: '3 Dias', value: 'THREE_DAYS' },
    { label: 'Semana', value: 'WEEK' },
    { label: 'Mês', value: 'MONTH' },
];

const getDayOfWeekAbrev = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
};

const getWeekDaysForHeader = (baseDate: Date) => {
    const days: Date[] = [];
    const base = new Date(baseDate);
    base.setHours(0, 0, 0, 0);
    const dayOfWeek = base.getDay();
    const startOfWeek = new Date(base);
    startOfWeek.setDate(base.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push(d);
    }
    return days;
};

export const AgendaHeader = ({ 
    selectedDate, 
    viewMode, 
    onChangeViewMode, 
    visibleDays,
    onOpenMonthPicker,
    onDayPress
}: AgendaHeaderProps) => {
    
    // Pega o nome do mês e ano atual para o canto esquerdo (ex: "Outubro 2026")
    const month = selectedDate.toLocaleDateString('pt-BR', { month: 'long'});
    const year = selectedDate.toLocaleDateString('pt-BR', {year: 'numeric'})
    const insets = useSafeAreaInsets();

    const isTodayVisible = useMemo(() => {
        const today = new Date();
        if (viewMode === 'MONTH') {
            return selectedDate.getMonth() === today.getMonth() && 
                   selectedDate.getFullYear() === today.getFullYear();
        }
        return visibleDays.some(day => day.toDateString() === today.toDateString());
    }, [visibleDays, selectedDate, viewMode]);

    const headerWeekDays = useMemo(() => getWeekDaysForHeader(selectedDate), [selectedDate]);
    
    return (
        <View style={[agendaHeaderStyles.container]}>
            <View style={[agendaHeaderStyles.topRow, {paddingTop:insets.top + a(10)}]}>
                <TouchableOpacity onPress={onOpenMonthPicker} style={agendaHeaderStyles.monthSelector}>
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <Text style={agendaHeaderStyles.monthText}>{month}</Text>
                        <Text style={agendaHeaderStyles.yearText}>{year}</Text>
                    </View> 
                    <Ionicons name="chevron-down" color={Colors.white} size={td(18)}/>
                </TouchableOpacity>

                <View style={agendaHeaderStyles.tabsContainer}>
                    {VIEW_OPTIONS.map((option) => {
                        const isActive = viewMode === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => onChangeViewMode(option.value)}
                                style={[
                                    agendaHeaderStyles.tabButton,
                                    isActive && agendaHeaderStyles.tabButtonActive
                                ]}
                            >
                                <Text style={[
                                    agendaHeaderStyles.tabText,
                                    isActive && agendaHeaderStyles.tabTextActive
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {viewMode !== 'MONTH' && (
                <View style={agendaHeaderStyles.daysAxisContainer}>
                    <View style={agendaHeaderStyles.timeAxisSpacer}>
                        {!isTodayVisible && (
                            <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => onChangeViewMode(viewMode, new Date())}
                            style={{
                                backgroundColor: Colors.white,
                                paddingHorizontal: l(8),
                                paddingVertical: a(4),
                                borderRadius: td(6),
                                borderColor:Colors.corButton,
                                borderWidth:1
                            }}
                            >
                                <Text style={{ color:Colors.corButton, fontFamily:fonts.robotoBold, fontSize: td(12) }}>
                                    Hoje
                                </Text>
                            </TouchableOpacity>
                        )}
                            
                    </View>
                    
                    <View style={agendaHeaderStyles.columnsWrapper}>
                        {headerWeekDays.map((day, index) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            
                            // Verifica se o dia atual está ativo na grade
                            const isActive = visibleDays.some(vd => vd.toDateString() === day.toDateString());

                            // LÓGICA DE CONEXÃO: Verifica se os vizinhos também estão ativos na grade
                            const prevDay = index > 0 ? headerWeekDays[index - 1] : null;
                            const nextDay = index < 6 ? headerWeekDays[index + 1] : null;

                            const isPrevActive = prevDay ? visibleDays.some(vd => vd.toDateString() === prevDay.toDateString()) : false;
                            const isNextActive = nextDay ? visibleDays.some(vd => vd.toDateString() === nextDay.toDateString()) : false;

                            const isLeftConnected = isActive && isPrevActive;
                            const isRightConnected = isActive && isNextActive;

                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    style={agendaHeaderStyles.dayColumnHeader}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        if (onDayPress) onDayPress(day);
                                    }}
                                >
                                    <Text style={[
                                        agendaHeaderStyles.dayOfWeekText, 
                                        isToday && agendaHeaderStyles.todayText
                                    ]}>
                                        {getDayOfWeekAbrev(day)}
                                    </Text>
                                    
                                    {/* CONTÊINER RELATIVO PARA A PÍLULA DE CONEXÃO */}
                                    <View style={agendaHeaderStyles.dateRangeWrapper}>
                                        
                                        {/* Pontes de Conexão Absolutas (Renderizadas por trás do círculo) */}
                                        {isLeftConnected && <View style={agendaHeaderStyles.connectorLeft} />}
                                        {isRightConnected && <View style={agendaHeaderStyles.connectorRight} />}

                                        {/* Círculo do Número */}
                                        <View style={[
                                            agendaHeaderStyles.dateCircle, 
                                            isActive && agendaHeaderStyles.dateCircleActive,
                                            isToday && isActive && agendaHeaderStyles.todayActiveCircle // Adiciona a borda branca se for Hoje E estiver selecionado
                                        ]}>
                                            <Text style={[
                                                agendaHeaderStyles.dayOfMonthText, 
                                                isToday && !isActive && agendaHeaderStyles.todayText, 
                                                isActive && agendaHeaderStyles.activeTextCircle       
                                            ]}>
                                                {day.getDate()}
                                            </Text>
                                        </View>
                                        
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
};