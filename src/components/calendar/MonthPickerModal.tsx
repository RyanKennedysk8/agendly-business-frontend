import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { monthPickerStyles } from './styles/monthPickerStyles';

interface MonthPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedDate: Date;
    onSelectMonth: (year: number, month: number) => void;
}

const MONTHS_NAMES = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
];

export const MonthPickerModal = ({ isVisible, onClose, selectedDate, onSelectMonth }: MonthPickerModalProps) => {
    // Estado local para permitir navegar pelos anos dentro do modal antes de confirmar
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

    useEffect(() => {
        if (isVisible) {
            setCurrentYear(selectedDate.getFullYear());
        }
    }, [isVisible, selectedDate]);

    const incrementYear = () => setCurrentYear(prev => prev + 1);
    const decrementYear = () => setCurrentYear(prev => prev - 1);

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={monthPickerStyles.modalOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                {/* Evita que cliques internos fechem o modal */}
                <TouchableWithoutFeedback>
                    <View style={monthPickerStyles.modalContent}>
                        
                        {/* Seletor de Ano */}
                        <View style={monthPickerStyles.yearHeader}>
                            <TouchableOpacity onPress={decrementYear} style={monthPickerStyles.navButton}>
                                <Text style={monthPickerStyles.navButtonText}>◀</Text>
                            </TouchableOpacity>
                            
                            <Text style={monthPickerStyles.yearText}>{currentYear}</Text>
                            
                            <TouchableOpacity onPress={incrementYear} style={monthPickerStyles.navButton}>
                                <Text style={monthPickerStyles.navButtonText}>▶</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Grade de Meses */}
                        <View style={monthPickerStyles.monthsGrid}>
                            {MONTHS_NAMES.map((monthName, index) => {
                                const isCurrentMonth = 
                                    selectedDate.getMonth() === index && 
                                    selectedDate.getFullYear() === currentYear;

                                return (
                                    <TouchableOpacity
                                        key={monthName}
                                        style={[
                                            monthPickerStyles.monthCell,
                                            isCurrentMonth && monthPickerStyles.monthCellActive
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            onSelectMonth(currentYear, index);
                                            onClose();
                                        }}
                                    >
                                        <Text style={[
                                            monthPickerStyles.monthText,
                                            isCurrentMonth && monthPickerStyles.monthTextActive
                                        ]}>
                                            {monthName}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};