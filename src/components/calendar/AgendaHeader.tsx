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


export const AgendaHeader = ({ 
    selectedDate, 
    viewMode, 
    onChangeViewMode, 
    visibleDays,
    onOpenMonthPicker,
    onDayPress
}: AgendaHeaderProps) => {
    
    // Pega o nome do mês e ano atual para o canto esquerdo (ex: "Outubro 2026")
    const monthYear = selectedDate.toLocaleDateString('pt-BR', { month: 'long'});
    const insets = useSafeAreaInsets();

    const isTodayVisible = useMemo(() => {
        const today = new Date();
        
        if (viewMode === 'MONTH') {
            // No modo mês, verificamos se estamos no mês e ano atuais
            return selectedDate.getMonth() === today.getMonth() && 
                   selectedDate.getFullYear() === today.getFullYear();
        }
        
        // Nos modos Dia, 3 Dias ou Semana, verificamos se o array de dias visíveis contém o dia de hoje
        return visibleDays.some(day => day.toDateString() === today.toDateString());
    }, [visibleDays, selectedDate, viewMode]);


    return (
        <View style={[agendaHeaderStyles.container]}>
            <View style={[agendaHeaderStyles.topRow, {paddingTop:insets.top}]}>
                <TouchableOpacity onPress={onOpenMonthPicker} style={agendaHeaderStyles.monthSelector}>
                    <Text style={agendaHeaderStyles.monthText}>{monthYear}</Text>
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

            {/* Linha Inferior: Dias da grade (Oculto se for visualização Mensal) */}
            {viewMode !== 'MONTH' && (
                <View style={agendaHeaderStyles.daysAxisContainer}>
                    {/* Espaçador para alinhar com a régua de horas (TimeAxis) de width fixo */}
                    <View style={agendaHeaderStyles.timeAxisSpacer} >
                        {!isTodayVisible && (
                            <TouchableOpacity 
                                activeOpacity={0.6}
                                onPress={() => onChangeViewMode(viewMode, new Date())} 
                                style={{
                                    paddingHorizontal: l(7),
                                    paddingVertical: a(5),
                                    borderRadius: td(8),
                                    borderWidth:1,
                                    borderColor:Colors.corButton
                                }}
                            >
                                <Text style={{ color: Colors.corButton,fontFamily:fonts.robotoBold, fontSize: td(12) }}>
                                    Hoje
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <View style={agendaHeaderStyles.columnsWrapper}>
                        {visibleDays.map((day, index) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            const isClickable = viewMode !== 'DAY'; // Bloqueia toque redundante se já estiver no modo Dia

                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    style={agendaHeaderStyles.dayColumnHeader}
                                    activeOpacity={isClickable ? 0.6 : 1}
                                    onPress={() => {
                                        if (isClickable && onDayPress) {
                                            onDayPress(day);
                                        }
                                    }}
                                >
                                    <Text style={[agendaHeaderStyles.dayOfWeekText, isToday && agendaHeaderStyles.todayText]}>
                                        {getDayOfWeekAbrev(day)}
                                    </Text>
                                    <View style={[agendaHeaderStyles.dateCircle, isToday && agendaHeaderStyles.dateCircleActive]}>
                                        <Text style={[agendaHeaderStyles.dayOfMonthText, isToday && agendaHeaderStyles.todayTextCircle]}>
                                            {day.getDate()}
                                        </Text>
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