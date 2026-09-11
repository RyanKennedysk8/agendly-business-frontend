import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { CalendarPager } from '@/components/calendar/CalendarPager';

export default function AgendamentoScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content"/>
            
            <CalendarPager />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    }
});