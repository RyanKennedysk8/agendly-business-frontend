import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface DailyLoadingPlaceholderProps {
    date: Date;
}

export const DailyLoadingPlaceholder = ({ date }: DailyLoadingPlaceholderProps) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    const year = date.getFullYear();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="calendar-outline" size={td(48)} color={Colors.corTextLight || '#A0AEC0'} />
                
                <Text style={styles.dateText}>
                    <Text style={styles.dayText}>{day} de </Text>
                    <Text style={styles.monthText}>{month} </Text>
                    <Text style={styles.yearText}>{year}</Text>
                </Text>
                
                <Text style={styles.subtitle}>Organizando a agenda...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        marginTop: a(16),
        fontSize: td(18),
        color: Colors.corText,
        textTransform: 'capitalize',
    },
    dayText: {
        fontFamily: fonts.robotoBold,
    },
    monthText: {
        fontFamily: fonts.robotoMedium,
    },
    yearText: {
        fontFamily: fonts.robotoRegular,
    },
    subtitle: {
        marginTop: a(8),
        fontSize: td(14),
        fontFamily: fonts.robotoRegular,
        color: Colors.corTextLight || '#A0AEC0',
    }
});