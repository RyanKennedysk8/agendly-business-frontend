import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Pressable, ScrollView } from 'react-native';
import Animated, { 
    LinearTransition, 
    Easing, 
    FadeIn, 
    FadeOut 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EllipsisVertical, ChevronDown, ListFilter} from 'lucide-react-native';

import { agendaHeaderStyles } from './styles/agendaHeaderStyles';
import { Colors } from '@/colors/color';
import { a, l, td } from '@/constants/responsive';
import { CalendarColors } from './styles/constants/calendarColors';
import { AppIcon } from '@/icons/AppIcon';

interface AgendaHeaderProps {
    selectedDate: Date;
    visibleDays: Date[];
    onOpenMonthPicker: () => void;
    onDayPress?: (date: Date) => void;
    onNavigateDate?: (direction: 'PREV' | 'NEXT', temporalMode: 'WEEK' | 'MONTH') => void;
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const WEEK_DAYS_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

const getMonthDaysForHeader = (baseDate: Date) => {
    const days: Date[] = [];
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPadding = firstDay.getDay();
    for (let i = startPadding; i > 0; i--) {
        days.push(new Date(year, month, 1 - i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    const endPadding = 42 - days.length; 
    for (let i = 1; i <= endPadding; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return days;
};

const getNavDates = (baseDate: Date, isMonth: boolean) => {
    const prev = new Date(baseDate);
    const next = new Date(baseDate);

    if (isMonth) {
        prev.setDate(1); prev.setMonth(prev.getMonth() - 1);
        next.setDate(1); next.setMonth(next.getMonth() + 1);
    } else {
        prev.setDate(prev.getDate() - 7);
        next.setDate(next.getDate() + 7);
    }

    return { prevDate: prev, nextDate: next };
};

const DRAWER_TRANSITION = LinearTransition.duration(500).easing(Easing.out(Easing.cubic));

export const AgendaHeader = ({
    selectedDate,
    visibleDays,
    onOpenMonthPicker,
    onDayPress,
    onNavigateDate
}: AgendaHeaderProps) => {
    
    const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const dayNum = selectedDate.getDate().toString().padStart(2, '0');
    const dayString = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '');
    const month = selectedDate.toLocaleDateString('pt-BR', { month: '2-digit' });
    const year = selectedDate.toLocaleDateString('pt-BR', { year: '2-digit' });

    const today = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    }, []);

    const isTodaySelected = selectedDate.toDateString() === today.toDateString();

    const { prevDate, nextDate } = useMemo(() => getNavDates(selectedDate, isDrawerExpanded), [selectedDate, isDrawerExpanded]);

    const prevMatrix = useMemo(() => isDrawerExpanded ? getMonthDaysForHeader(prevDate) : getWeekDaysForHeader(prevDate), [prevDate, isDrawerExpanded]);
    const currMatrix = useMemo(() => isDrawerExpanded ? getMonthDaysForHeader(selectedDate) : getWeekDaysForHeader(selectedDate), [selectedDate, isDrawerExpanded]);
    const nextMatrix = useMemo(() => isDrawerExpanded ? getMonthDaysForHeader(nextDate) : getWeekDaysForHeader(nextDate), [nextDate, isDrawerExpanded]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollRef.current?.scrollTo({ x: WINDOW_WIDTH, y: 0, animated: false });
        }, 0);
        return () => clearTimeout(timeout);
    }, [selectedDate, isDrawerExpanded]);

    const handleDaySelection = (day: Date) => {
        if (onDayPress) onDayPress(day);
        if (isDrawerExpanded) setIsDrawerExpanded(false);
    };

    const handleMomentumScrollEnd = (e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        
        if (x < WINDOW_WIDTH / 2) {
            if (onNavigateDate) onNavigateDate('PREV', isDrawerExpanded ? 'MONTH' : 'WEEK');
        } 
        else if (x > WINDOW_WIDTH * 1.5) {
            if (onNavigateDate) onNavigateDate('NEXT', isDrawerExpanded ? 'MONTH' : 'WEEK');
        }
    };

    const renderMatrixPage = (matrix: Date[]) => (
        <View style={[agendaHeaderStyles.gridWrapper, { width: WINDOW_WIDTH }]}>
            {matrix.map((day) => {
                const isActive = isDrawerExpanded 
                    ? day.toDateString() === selectedDate.toDateString() 
                    : visibleDays.some(vd => vd.toDateString() === day.toDateString());

                const isToday = day.toDateString() === today.toDateString();
                const isCurrentMonth = day.getMonth() === selectedDate.getMonth();

                return (
                    <View key={day.toISOString()} style={agendaHeaderStyles.dayCell}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => handleDaySelection(day)}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <View style={[
                                agendaHeaderStyles.dateCircle,
                                isActive && agendaHeaderStyles.dateCircleActive,
                                isToday && isActive && { backgroundColor: Colors.errorDisable, borderColor:Colors.error, borderWidth:0.5},
                            ]}>
                                <Text
                                    style={[
                                        agendaHeaderStyles.dayOfMonthText,
                                        !isCurrentMonth && isDrawerExpanded && { opacity: 0.3 },
                                        isToday && !isActive && { color: Colors.error },
                                        isActive &&
                                            (isToday
                                                ? agendaHeaderStyles.activeTextCircleToday
                                                : agendaHeaderStyles.activeTextCircle),
                                    ]}
                                >
                                    {day.getDate()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={[agendaHeaderStyles.container, { paddingTop: insets.top + a(10) }]}>
            
            <View style={[agendaHeaderStyles.topRow ]}>
                <View style={{width:l(60), }}>
                    
                </View>

                <TouchableOpacity onPress={onOpenMonthPicker} style={agendaHeaderStyles.monthSelector}>
                    {isTodaySelected ? (
                        <Text style={agendaHeaderStyles.monthText}>Hoje</Text>
                    ) : (
                        <Text style={agendaHeaderStyles.monthText}>{dayString}, {dayNum}/{month}/{year}</Text>
                    )}
                    <ChevronDown color={Colors.corScreen} size={td(18)} strokeWidth={2} style={{ marginLeft: td(6) }} />
                </TouchableOpacity>


                
                <View style={{flexDirection:"row", gap:l(10), minWidth:l(60), justifyContent:"flex-end"}}>
                    <AppIcon icon={ListFilter} size={td(22)} color={Colors.corScreen} strokeWidth={2.5} />
                    <AppIcon icon={EllipsisVertical} size={td(22)} color={Colors.corScreen} strokeWidth={2}/>
                </View>

            </View>



            <View style={agendaHeaderStyles.weekDaysHeader}>
                {WEEK_DAYS_LABELS.map((label, idx) => (
                    <View key={`label-${idx}`} style={agendaHeaderStyles.weekDayLabelContainer}>
                        <Text style={agendaHeaderStyles.dayOfWeekText}>{label}</Text>
                    </View>
                ))}
            </View>

            <View style={{ zIndex: 100 }}>
                {isDrawerExpanded && (
                    <Animated.View 
                        entering={FadeIn.duration(300)} 
                        exiting={FadeOut.duration(300)}
                        style={[agendaHeaderStyles.overlay, { height: WINDOW_HEIGHT }]}
                    >
                        <Pressable style={{ flex: 1 }} onPress={() => setIsDrawerExpanded(false)} />
                    </Animated.View>
                )}

                <View style={{ opacity: 0 }} pointerEvents="none">
                    <View style={agendaHeaderStyles.daysGridContainer}>
                        <View style={[agendaHeaderStyles.gridWrapper, { width: WINDOW_WIDTH }]}>
                            {getWeekDaysForHeader(selectedDate).map((_, index) => (
                                <View key={`ghost-${index}`} style={agendaHeaderStyles.dayCell}>
                                    <View style={agendaHeaderStyles.dateCircle}>
                                        <Text style={agendaHeaderStyles.dayOfMonthText}>00</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={agendaHeaderStyles.drawerHandle}>
                        <Ionicons name="chevron-down" size={td(16)} />
                    </View>
                </View>

                <Animated.View style={[
                    agendaHeaderStyles.absoluteDrawerWrapper,
                    isDrawerExpanded && agendaHeaderStyles.drawerShadow 
                ]}>
                    <Animated.View 
                        layout={DRAWER_TRANSITION}
                        style={[agendaHeaderStyles.daysGridContainer, isDrawerExpanded && agendaHeaderStyles.expandedDrawerMaxHeight]}
                    >
                        <ScrollView
                            ref={scrollRef}
                            horizontal
                            pagingEnabled
                            bounces={false}
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={handleMomentumScrollEnd}
                            contentOffset={{ x: WINDOW_WIDTH, y: 0 }} 
                        >
                            {renderMatrixPage(prevMatrix)}
                            {renderMatrixPage(currMatrix)}
                            {renderMatrixPage(nextMatrix)}
                        </ScrollView>
                    </Animated.View>

                    <TouchableOpacity 
                        activeOpacity={0.7} 
                        style={agendaHeaderStyles.drawerHandle}
                        onPress={() => setIsDrawerExpanded(!isDrawerExpanded)}
                    >
                        <Ionicons 
                            name={isDrawerExpanded ? "chevron-up" : "chevron-down"} 
                            color={Colors.corTextLight || '#A0AEC0'} 
                            size={td(16)} 
                        />
                    </TouchableOpacity>
                </Animated.View>

            </View>
        </View>
    );
};