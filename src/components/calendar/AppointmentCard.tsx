import { RenderableAppointment } from '@/utils/overLapEngine';
import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View, LayoutChangeEvent } from 'react-native';
import { appointmentCardStyles } from './styles/appointmentCardStyles';
import { darkenColor} from './styles/colorMapper';
import { MINUTE_HEIGHT } from '@/utils/calendarMetrics';
import { scale as l, moderateScale as td } from 'react-native-size-matters';
import { Colors } from '@/colors/color';

interface AppointmentCardProps {
    appointment: RenderableAppointment;
    onPress?: (appointment: RenderableAppointment) => void;
}

export const AppointmentCard = memo(({ appointment, onPress }: AppointmentCardProps) => {
    const { layout, serviceName, employeeName, startTime, endTime } = appointment;

    const backgroundColor = appointment.employeeColor ?? Colors.orange;
    const borderColor = darkenColor(backgroundColor);


    const startStr = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Estado local para armazenar a largura exata renderizada em pixels (dp)
    const [measuredWidth, setMeasuredWidth] = useState<number>(
        typeof layout.width === 'number' ? layout.width : 0
    );

    // Callback disparado nativamente assim que o layout do card é calculado na tela
    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        // Evita re-renders desnecessários se o valor medido for idêntico
        if (width !== measuredWidth) {
            setMeasuredWidth(width);
        }
    };

    // Fallback de segurança para a primeira renderização (antes do onLayout disparar)
    const currentWidth = measuredWidth > 0 
        ? measuredWidth 
        : (typeof layout.width === 'number' ? layout.width : 999);

    // Gatilhos responsivos baseados nas dimensões físicas reais calculadas pelo dispositivo
    const isCompactHeight = layout.height <= MINUTE_HEIGHT * 15;
    const isNarrowWidth = currentWidth < l(45); // Se o card físico tiver menos de 45dp de largura

    const renderContent = () => {
        // WIDTH REDUZIDO (VERTICAL DE ALTA DENSIDADE)
        if (isNarrowWidth) {
            return (
                <View style={appointmentCardStyles.verticalRotationWrapper}>
                    <View style={[
                        appointmentCardStyles.verticalTextContainer, 
                        { 
                            // Inversão geométrica pura baseada nas dimensões reais mensuradas
                            width: layout.height, 
                            height: currentWidth 
                        }
                    ]}>
                        <Text 
                            style={appointmentCardStyles.verticalServiceName} 
                            numberOfLines={1} 
                            ellipsizeMode="tail"
                        >
                            {serviceName}
                        </Text>
                    </View>
                </View>
            );
        }

        // HEIGHT CURTO (15 MINUTOS HORIZONTAL CONCATENADO)
        if (isCompactHeight) {
            return (
                <Text 
                    style={appointmentCardStyles.clientNameSmall} 
                    numberOfLines={1}
                >
                    {serviceName} • {employeeName} • {startStr} - {endStr}
                </Text>
            );
        }

        // RENDERIZAÇÃO COMPLETA PADRÃO
        return (
            <>
                <Text style={appointmentCardStyles.clientName} numberOfLines={1}>
                    {serviceName}
                </Text>
                <Text style={appointmentCardStyles.serviceDetails} numberOfLines={1}>
                    {employeeName}
                </Text>
                <Text style={appointmentCardStyles.timeText} numberOfLines={1}>
                    {startStr} - {endStr}
                </Text> 
            </>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => console.log(`Abrir agendamento: ${appointment.serviceName}`)}
            onLayout={handleLayout} // Vinculação do listener nativo de medição
            style={[
                appointmentCardStyles.cardContainer,
                {
                    top: layout.top,
                    height: layout.height,
                    left: layout.left,
                    width: layout.width, // Passa o DimensionValue original para renderização nativa
                    zIndex: layout.zIndex,
                    backgroundColor: backgroundColor,
                    borderLeftColor: borderColor,
                    // Remove o padding interno se estiver no modo vertical para evitar compressão de texto
                    padding: isNarrowWidth ? 0 : td(3), 
                }
            ]}
        >
            {renderContent()}
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    // A memoização profunda continua checando as propriedades estruturais passadas pelo OverlapEngine.
    // Alterações internas de state (como o measuredWidth no onLayout) ignoram o memo e atualizam a View corretamente.
    return prevProps.appointment.appointmentId === nextProps.appointment.appointmentId &&
           prevProps.appointment.layout.top === nextProps.appointment.layout.top &&
           prevProps.appointment.layout.left === nextProps.appointment.layout.left &&
           prevProps.appointment.layout.width === nextProps.appointment.layout.width &&
           prevProps.appointment.layout.height === nextProps.appointment.layout.height;
});