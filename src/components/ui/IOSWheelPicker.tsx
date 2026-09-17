import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface WheelItem {
  label: string;
  value: number;
}

interface IOSWheelPickerProps {
  data: WheelItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  unit: string;
}

const ITEM_HEIGHT = a(44);
const VISIBLE_ITEMS = 5;

// Subcomponente isolado para garantir performance na thread de UI
const AnimatedWheelItem = ({ 
  item, 
  index, 
  scrollY 
}: { 
  item: WheelItem; 
  index: number; 
  scrollY:any
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Calcula a posição ideal deste item no scroll
    const itemPosition = index * ITEM_HEIGHT;
    
    // Interpolação para opacidade: 1 no centro, 0.35 nas bordas
    const opacity = interpolate(
      scrollY.value,
      [itemPosition - ITEM_HEIGHT, itemPosition, itemPosition + ITEM_HEIGHT],
      [0.35, 1, 0.35],
      Extrapolation.CLAMP
    );

    // Interpolação para tamanho: simula a mudança de fontSize de td(18) para td(21)
    // O scale de 1.16 corresponde aproximadamente à proporção (21 / 18)
    const scale = interpolate(
      scrollY.value,
      [itemPosition - ITEM_HEIGHT, itemPosition, itemPosition + ITEM_HEIGHT],
      [1, 1.16, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.itemRow}>
      <Animated.Text style={[styles.itemText, animatedStyle]}>
        {item.label}
      </Animated.Text>
    </View>
  );
};

export function IOSWheelPicker({ data, selectedValue, onValueChange, unit }: IOSWheelPickerProps) {
  const flatListRef = useRef<Animated.FlatList<WheelItem>>(null);
  const selectedIndex = data.findIndex((item) => item.value === selectedValue);
  
  // Shared value captura o scroll em 60/120fps
  const scrollY = useSharedValue(selectedIndex >= 0 ? selectedIndex * ITEM_HEIGHT : 0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const triggerHaptic = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  // Dispara o haptic dinamicamente a cada "tick" de item que passa pelo centro
  useAnimatedReaction(
    () => Math.round(scrollY.value / ITEM_HEIGHT),
    (currentIndex, previousIndex) => {
      if (currentIndex !== previousIndex && previousIndex !== null) {
        if (currentIndex >= 0 && currentIndex < data.length) {
          runOnJS(triggerHaptic)();
        }
      }
    }
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

      if (data[clampedIndex] && data[clampedIndex].value !== selectedValue) {
        onValueChange(data[clampedIndex].value);
      }
    },
    [data, selectedValue, onValueChange]
  );

  return (
    <View style={styles.pickerContainer}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={data}
        keyExtractor={(item) => `${unit}-${item.value}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        overScrollMode="never" 
        nestedScrollEnabled={true} 
        removeClippedSubviews={Platform.OS === 'android'} 
        contentContainerStyle={{
          paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
        }}
        renderItem={({ item, index }) => (
          <AnimatedWheelItem 
            item={item} 
            index={index} 
            scrollY={scrollY} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flex: 1,
  },
  itemRow: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: td(18),
    fontFamily: fonts?.robotoBold,
    color: Colors.corText,
  },
});