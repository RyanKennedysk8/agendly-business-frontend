import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ViewMode } from '../../hooks/useAgendaNavigation';
import { agendaHeaderStyles } from './styles/agendaHeaderStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/colors/color';
import { td } from '@/constants/responsive';

interface AgendaHeaderProps {
    selectedDate: Date;
    viewMode: ViewMode;
    onChangeViewMode: (mode: ViewMode) => void;
    visibleDays: Date[];
    onOpenMonthPicker: () => void; // Gatilho para abrir o modal de seleção de mês no futuro
}

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
    { label: 'Dia', value: 'DAY' },
    { label: '3 Dias', value: 'THREE_DAYS' },
    { label: 'Semana', value: 'WEEK' },
    { label: 'Mês', value: 'MONTH' },
];

export const AgendaHeader = ({ 
    selectedDate, 
    viewMode, 
    onChangeViewMode, 
    visibleDays,
    onOpenMonthPicker 
}: AgendaHeaderProps) => {
    
    // Pega o nome do mês e ano atual para o canto esquerdo (ex: "Outubro 2026")
    const monthYear = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const insets = useSafeAreaInsets();
    return (
        <View style={[agendaHeaderStyles.container, {paddingTop:insets.top}]}>
            {/* Linha Superior: Seletor de Mês e Abas */}
            <View style={agendaHeaderStyles.topRow}>
                <TouchableOpacity onPress={onOpenMonthPicker} style={agendaHeaderStyles.monthSelector}>
                    <Text style={agendaHeaderStyles.monthText}>{monthYear}</Text>
                    <Ionicons  name="chevron-down" color={Colors.white} size={td(14)} />
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
                <View style={agendaHeaderStyles.columnsRow}>
                    {visibleDays.map((date, index) => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        return (
                            <View key={`col-${index}`} style={agendaHeaderStyles.columnHeader}>
                                <Text style={[
                                    agendaHeaderStyles.columnDayName,
                                    isToday && { color: '#FF7A00', fontWeight: 'bold' } // Destaque para o dia de hoje
                                ]}>
                                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                </Text>
                                <Text style={[
                                    agendaHeaderStyles.columnDayNumber,
                                    isToday && { color: '#FF7A00' }
                                ]}>
                                    {date.getDate()}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};