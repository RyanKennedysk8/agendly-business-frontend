import { AppointmentDetail } from '@/types/appointments';
import { FlashList } from '@shopify/flash-list';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { computeAppointmentsCache, generateMonthMatrix } from '../../utils/monthEngine';
import { monthViewStyles } from './styles/monthViewStyles';
import { getEmployeeColor } from './styles/colorMapper';

interface MonthViewProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    appointments: AppointmentDetail[];
}

const WEEK_DAYS_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MonthView = ({ selectedDate, setSelectedDate, appointments = [] }: MonthViewProps) => {
    
    // 1. Memoriza a matriz matemática do mês atual
    const monthMatrix = useMemo(() => generateMonthMatrix(selectedDate), [selectedDate]);

    // 2. Memoriza o mapa hash de agendamentos por chave YYYY-MM-DD para busca O(1)
    const appointmentsCache = useMemo(() => computeAppointmentsCache(appointments), [appointments]);

    // 3. Filtra de forma linear apenas os registros pertencentes ao dia selecionado pelo gestor
    const selectedDayAppointments = useMemo(() => {
        const targetKey = selectedDate.toISOString().split('T')[0];
        return appointments.filter(appt => appt.startTime && appt.startTime.startsWith(targetKey))
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [selectedDate, appointments]);

    const renderDayCell = (date: Date, index: number) => {
        const dateKey = date.toISOString().split('T')[0];
        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const appointmentCount = appointmentsCache[dateKey] || 0;

        return (
            <TouchableOpacity
                key={`cell-${index}`}
                style={monthViewStyles.cellContainer}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(date)}
            >
                <View style={isSelected ? monthViewStyles.cellSelected : null}>
                    <Text style={[
                        monthViewStyles.cellDayText,
                        !isCurrentMonth && monthViewStyles.cellDayOutside,
                        isSelected && monthViewStyles.textSelected
                    ]}>
                        {date.getDate()}
                    </Text>
                </View>

                {/* Renderização condicional do badge indicador se houver demanda no dia */}
                {appointmentCount > 0 && (
                    <View style={monthViewStyles.badgeDot}>
                        <Text style={monthViewStyles.badgeText}>{appointmentCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderAppointmentItem = ({ item }: { item: AppointmentDetail }) => {
        const colors = getEmployeeColor(item.employeeId);
        const timeStr = new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={monthViewStyles.appointmentItem}>
                <Text style={monthViewStyles.timeIndicator}>{timeStr}</Text>
                <View style={[monthViewStyles.cardContent, { borderLeftColor: colors.border }]}>
                    <Text style={monthViewStyles.serviceTitle}>{item.serviceName}</Text>
                    <Text style={monthViewStyles.staffName}>Profissional: {item.employeeName}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={monthViewStyles.container}>
            {/* Metade Superior: Grade Calendário */}
            <View style={monthViewStyles.calendarSection}>
                <View style={monthViewStyles.weekDaysRow}>
                    {WEEK_DAYS_LABELS.map(label => (
                        <Text key={label} style={monthViewStyles.weekDayLabel}>{label}</Text>
                    ))}
                </View>
                
                <View style={monthViewStyles.gridWrapper}>
                    {monthMatrix.map((date, index) => renderDayCell(date, index))}
                </View>
            </View>

            {/* Metade Inferior: Listagem Otimizada Nativa */}
            <FlashList
                data={selectedDayAppointments}
                keyExtractor={(item) => item.appointmentId}
                renderItem={renderAppointmentItem}
                style={monthViewStyles.listSection}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={monthViewStyles.listEmptyContainer}>
                        <Text style={monthViewStyles.listEmptyText}>Nenhum agendamento para este dia.</Text>
                    </View>
                }
            />
        </View>
    );
};