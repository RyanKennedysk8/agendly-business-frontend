import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';

const ITEM_HEIGHT = a(50);
const HOURS = Array.from({ length: 13 }, (_, i) => i); 
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); 

// 1. EXTRAÍMOS O ITEM PARA UM COMPONENTE REAL
// Assim o React permite usar o hook useAnimatedStyle aqui dentro.
interface WheelItemProps {
    item: number;
    index: number;
    scrollY: SharedValue<number>;
    suffix: string;
}

const WheelItem = ({ item, index, scrollY, suffix }: WheelItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        const itemPosition = index * ITEM_HEIGHT;
        const distance = Math.abs(scrollY.value - itemPosition);
        
        const scale = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1.1, 0.9, 0.8], Extrapolation.CLAMP);
        const opacity = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1, 0.3, 0.1], Extrapolation.CLAMP);

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <Animated.View style={[styles.wheelItem, animatedStyle]}>
            <Text style={styles.wheelText}>
                {String(item).padStart(2, '0')}{suffix}
            </Text>
        </Animated.View>
    );
};

// 2. A ROLETA EM SI
interface WheelProps {
    data: number[];
    value: number;
    onChange: (val: number) => void;
    suffix?: string;
}

const Wheel = ({ data, value, onChange, suffix = '' }: WheelProps) => {
    const scrollY = useSharedValue(0);
    const flatListRef = useRef<Animated.FlatList<number>>(null);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        if (data[index] !== undefined) {
            onChange(data[index]);
        }
    };

    useEffect(() => {
        const index = data.findIndex(item => item === value);
        if (index !== -1 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: false });
            }, 100);
        }
    }, []);

    const renderItem = ({ item, index }: { item: number; index: number }) => {
        // Agora o renderItem apenas chama o componente isolado
        return <WheelItem item={item} index={index} scrollY={scrollY} suffix={suffix} />;
    };

    return (
        <View style={styles.wheelContainer}>
            <Animated.FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => String(item)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            />
        </View>
    );
};

// 3. O MODAL COMPLETO
interface DurationPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    initialMinutes: number;
    onConfirm: (totalMinutes: number) => void;
    txtTypeTime:string;
}

export function DurationPickerModal({ isVisible, onClose, initialMinutes, onConfirm, txtTypeTime}: DurationPickerModalProps) {
    const insets = useSafeAreaInsets();
    
    const [selectedHour, setSelectedHour] = useState(Math.floor((initialMinutes || 0) / 60));
    const [selectedMinute, setSelectedMinute] = useState((initialMinutes || 0) % 60);

    const formatDurationText = (h: number, m: number) => {
        if (h === 0 && m === 0) return '0 min';
        const hText = h > 0 ? `${h}h ` : '';
        const mText = m > 0 ? `${m}min` : '';
        return (hText + mText).trim();
    };

    const handleConfirm = () => {
        onConfirm(selectedHour * 60 + selectedMinute);
        onClose();
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton} hitSlop={20}>
                        <Ionicons name="arrow-back" size={td(24)} color="#0F172A" />
                        <Text style={styles.headerTitle}>Fim</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.selectionHighlight} />
                    
                    <View style={styles.wheelsWrapper}>
                        <View style={styles.wheelColumn}>
                            <Wheel data={HOURS} value={selectedHour} onChange={setSelectedHour} />
                        </View>
                        <View style={styles.wheelColumn}>
                            <Wheel data={MINUTES} value={selectedMinute} onChange={setSelectedMinute} />
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerLabel}>DURAÇÃO DO {txtTypeTime}</Text>
                    <Text style={styles.footerDuration}>{formatDurationText(selectedHour, selectedMinute)}</Text>
                    
                    <TouchableOpacity style={styles.okButton} activeOpacity={0.8} onPress={handleConfirm}>
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: l(20), height: a(56) },
    backButton: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: td(18), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A', marginLeft: l(10) },
    
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    selectionHighlight: {
        position: 'absolute',
        width: '80%',
        height: ITEM_HEIGHT,
        backgroundColor: '#F1F5F9',
        borderRadius: td(12),
        zIndex: 0,
    },
    wheelsWrapper: { flexDirection: 'row', width: '80%', height: ITEM_HEIGHT * 5, zIndex: 1 },
    wheelColumn: { flex: 1 },
    wheelContainer: { flex: 1 },
    wheelItem: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
    wheelText: { fontSize: td(24), fontFamily: fonts?.robotoMedium || 'System', color: '#0F172A' },
    
    footer: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingHorizontal: l(20), paddingTop: a(24), paddingBottom: a(20), alignItems: 'center' },
    footerLabel: { fontSize: td(12), fontFamily: fonts?.robotoMedium || 'System', color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: a(4) },
    footerDuration: { fontSize: td(22), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A', marginBottom: a(24) },
    okButton: { width: '100%', height: a(54), backgroundColor: '#1E293B', borderRadius: td(12), justifyContent: 'center', alignItems: 'center' },
    okButtonText: { fontSize: td(16), fontFamily: fonts?.robotoBold || 'System', color: '#FFFFFF' },
});