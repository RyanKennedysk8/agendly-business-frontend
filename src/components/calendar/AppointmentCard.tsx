import { RenderableAppointment } from '@/utils/overLapEngine';
import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { appointmentCardStyles } from './styles/appointmentCardStyles';
import { getEmployeeColor } from './styles/colorMapper';

interface AppointmentCardProps {
    appointment: RenderableAppointment;
    onPress?: (appointment: RenderableAppointment) => void;
}

export const AppointmentCard = memo(({ appointment, onPress }: AppointmentCardProps) => {
    const { layout, serviceName, employeeName, startTime, endTime } = appointment;
    const colors = getEmployeeColor(appointment.employeeId);

    // Formatação de hora local para exibição no card (ex: 08:30)
    const startStr = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPress && onPress(appointment)}
            style={[
                appointmentCardStyles.cardContainer,
                {
                    top: layout.top,
                    height: layout.height,
                    left: layout.left,
                    width: layout.width,
                    zIndex: layout.zIndex,
                    backgroundColor: colors.background,
                    borderLeftColor: colors.border,
                }
            ]}
        >
            <Text style={appointmentCardStyles.clientName} numberOfLines={1}>
                {employeeName} {/* Exibindo o funcionário para teste, no futuro pode ser o nome do Cliente */}
            </Text>
            
            {/* Se o agendamento tiver 15 min, o height será muito pequeno. O overflow: hidden do estilo 
                cortará o texto extra automaticamente, mas renderizamos condicionalmente por segurança visual */}
            {layout.height > 30 && (
                <>
                    <Text style={appointmentCardStyles.serviceDetails} numberOfLines={1}>
                        {serviceName}
                    </Text>
                    <Text style={appointmentCardStyles.timeText} numberOfLines={1}>
                        {startStr} - {endStr}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    // Memoização profunda: o card só re-renderiza se o ID ou o layout mudarem, economizando processamento
    return prevProps.appointment.appointmentId === nextProps.appointment.appointmentId &&
           prevProps.appointment.layout.top === nextProps.appointment.layout.top;
});